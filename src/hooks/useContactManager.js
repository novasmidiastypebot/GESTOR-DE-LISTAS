import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { professions, branches } from '@/lib/appConstants';

const normalizeString = (str) => {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

export const useContactManager = () => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [totalContacts, setTotalContacts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [filters, setFilters] = useState({ search: '', country: '', state: '', city: '', profession: '', branch: '', phone: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [editingContact, setEditingContact] = useState(null);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [bulkActionData, setBulkActionData] = useState({ branch: '', profession: '', country: '', state: '', city: '', phone: '' });
    const [dropdownOptions, setDropdownOptions] = useState({
        uniqueCountries: [],
        uniqueStates: [],
        uniqueCities: [],
        uniqueProfessions: [],
        uniqueBranches: [],
    });

    const loadContacts = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;
        
        try {
            let query = supabase
                .from('contacts')
                .select('*', { count: 'exact' })
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .range(startIndex, endIndex);

            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,website.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
            }
            if (filters.country) query = query.eq('country', filters.country);
            if (filters.state) query = query.eq('state', filters.state);
            if (filters.city) query = query.eq('city', filters.city);
            if (filters.profession) query = query.eq('profession', filters.profession);
            if (filters.branch) query = query.eq('branch', filters.branch);
            if (filters.phone) query = query.ilike('phone', `%${filters.phone}%`);

            const { data, error, count } = await query;

            if (error) throw error;
            setContacts(data);
            setTotalContacts(count || 0);
        } catch (error) {
            toast({ title: "Erro ao carregar contatos", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [user, currentPage, itemsPerPage, filters]);
    
    const loadDropdownOptions = useCallback(async (filterPayload = {}) => {
        if (!user) return;
        try {
            const { data, error } = await supabase.rpc('handle_data_flow', {
                p_action: 'get_distinct_contact_attributes',
                p_user_id: user.id,
                p_payload: filterPayload,
            });

            if (error) throw error;

            setDropdownOptions(prev => ({
                uniqueCountries: data.uniqueCountries || prev.uniqueCountries,
                uniqueStates: data.uniqueStates || [],
                uniqueCities: data.uniqueCities || [],
                uniqueProfessions: data.uniqueProfessions || prev.uniqueProfessions,
                uniqueBranches: data.uniqueBranches || prev.uniqueBranches,
            }));

        } catch (error) {
            toast({ title: "Erro ao carregar filtros", description: error.message, variant: "destructive" });
        }
    }, [user]);

    useEffect(() => {
        loadContacts();
    }, [loadContacts]);
    
    useEffect(() => {
        loadDropdownOptions();
    }, [loadDropdownOptions]);

    
    const handleSelectContact = (contactId) => {
        setSelectedContacts(prev => prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]);
    };

    const handleSelectAll = () => {
        const currentPageIds = contacts.map(c => c.id);
        const allSelectedOnPage = currentPageIds.length > 0 && currentPageIds.every(id => selectedContacts.includes(id));
        if (allSelectedOnPage) {
            setSelectedContacts(prev => prev.filter(id => !currentPageIds.includes(id)));
        } else {
            setSelectedContacts(prev => [...new Set([...prev, ...currentPageIds])]);
        }
    };

    const handleEditContact = (contact) => setEditingContact({ ...contact });

    const handleSaveContact = async () => {
        if (!editingContact) return;
        try {
            const { id, user_id, created_at, import_date, ...updateData } = editingContact;
            
            const { data, error } = await supabase
                .from('contacts')
                .update({ ...updateData, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select();

            if (error) throw error;
            
            setContacts(prev => prev.map(c => c.id === id ? data[0] : c));
            setEditingContact(null);
            toast({ title: "Contato atualizado! ✅" });
        } catch (error) {
            toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        }
    };

    const handleDeleteContact = async (contactId) => {
        try {
            const { error } = await supabase.from('contacts').delete().eq('id', contactId);
            if (error) throw error;
            
            toast({ title: "Contato removido! 🗑️" });
            loadContacts();
        } catch (error) {
            toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
        }
    };

    const getFilteredContactsForBulk = async () => {
        let query = supabase.from('contacts').select('id').eq('user_id', user.id);
        if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,website.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
        }
        if (filters.country) query = query.eq('country', filters.country);
        if (filters.state) query = query.eq('state', filters.state);
        if (filters.city) query = query.eq('city', filters.city);
        if (filters.profession) query = query.eq('profession', filters.profession);
        if (filters.branch) query = query.eq('branch', filters.branch);
        if (filters.phone) query = query.ilike('phone', `%${filters.phone}%`);
        
        const { data, error } = await query;
        if (error) throw error;
        return data.map(c => c.id);
    };

    const handleBulkUpdate = async () => {
        let contactsToUpdate = selectedContacts;
        if (selectedContacts.length === 0) {
            contactsToUpdate = await getFilteredContactsForBulk();
        }
        if (contactsToUpdate.length === 0) return;

        try {
            const updateData = {};
            if (bulkActionData.branch) updateData.branch = bulkActionData.branch;
            if (bulkActionData.profession) updateData.profession = bulkActionData.profession;
            if (bulkActionData.country) updateData.country = bulkActionData.country;
            if (bulkActionData.state) updateData.state = bulkActionData.state;
            if (bulkActionData.city) updateData.city = bulkActionData.city;
            if (bulkActionData.phone) updateData.phone = bulkActionData.phone;
            updateData.updated_at = new Date().toISOString();

            if (Object.keys(updateData).length <= 1) {
                toast({ title: "Nenhuma alteração selecionada", variant: "destructive" });
                return;
            }

            const { data, error } = await supabase
                .from('contacts')
                .update(updateData)
                .in('id', contactsToUpdate)
                .select();
            if (error) throw error;

            loadContacts();
            
            setSelectedContacts([]);
            setShowBulkActions(false);
            setBulkActionData({ branch: '', profession: '', country: '', state: '', city: '', phone: '' });
            toast({ title: "Edição em massa concluída! 🎉", description: `${data.length} contatos foram atualizados.` });
        } catch (error) {
            toast({ title: "Erro na edição em massa", description: error.message, variant: "destructive" });
        }
    };

    const handleBulkDelete = async (deleteFiltered = false) => {
        let contactsToDelete = [];
        try {
            if (deleteFiltered) {
                contactsToDelete = await getFilteredContactsForBulk();
            } else {
                contactsToDelete = selectedContacts;
            }
            
            if (contactsToDelete.length === 0) {
                toast({ title: "Nenhum contato para excluir", description: "Selecione contatos ou filtre para excluir em massa.", variant: "destructive" });
                return;
            }

            const totalToDelete = contactsToDelete.length;
            const CHUNK_SIZE = 500;
            let deletedCount = 0;

            for (let i = 0; i < totalToDelete; i += CHUNK_SIZE) {
                const chunk = contactsToDelete.slice(i, i + CHUNK_SIZE);
                const { data, error } = await supabase.from('contacts').delete().in('id', chunk).select();
                if (error) {
                  throw error;
                }
                deletedCount += data.length;
            }
            
            loadContacts();
            setSelectedContacts([]);
            toast({ title: "Exclusão em massa concluída! 🗑️", description: `${deletedCount} de ${totalToDelete} contatos foram removidos.` });
        } catch (error) {
            toast({ title: "Erro na exclusão em massa", description: error.message, variant: "destructive" });
        }
    };

    const fetchAllWithQuery = async (queryBuilder) => {
        const CHUNK_SIZE = 1000;
        let allData = [];
        let startIndex = 0;
        let hasMore = true;

        while (hasMore) {
            const { data, error } = await queryBuilder.range(startIndex, startIndex + CHUNK_SIZE - 1);
            if (error) throw error;

            if (data.length > 0) {
                allData = allData.concat(data);
                startIndex += CHUNK_SIZE;
            } else {
                hasMore = false;
            }
        }
        return allData;
    };

    const exportContacts = async () => {
        toast({ title: "Iniciando exportação...", description: "Isso pode levar alguns instantes. Aguarde." });
        try {
            let query = supabase.from('contacts').select('*').eq('user_id', user.id);
            if (filters.search) query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,website.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
            if (filters.country) query = query.eq('country', filters.country);
            if (filters.state) query = query.eq('state', filters.state);
            if (filters.city) query = query.eq('city', filters.city);
            if (filters.profession) query = query.eq('profession', filters.profession);
            if (filters.branch) query = query.eq('branch', filters.branch);
            if (filters.phone) query = query.ilike('phone', `%${filters.phone}%`);
            
            const contactsToExport = await fetchAllWithQuery(query);
            
            if (contactsToExport.length === 0) {
                toast({ title: "Nenhum contato para exportar.", variant: "destructive" });
                return;
            }

            const csvContent = [
                ['Nome', 'Email', 'Telefone', 'País', 'Estado', 'Cidade', 'Website', 'Profissão', 'Ramo'].join(','),
                ...contactsToExport.map(c => [c.name, c.email, c.phone, c.country, c.state, c.city, c.website, c.profession, c.branch].map(field => `"${field || ''}"`).join(','))
            ].join('\n');
            const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `contatos_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            toast({ title: `Exportação concluída! 📥`, description: `${contactsToExport.length} contatos exportados.` });
        } catch(error) {
            toast({ title: "Erro ao exportar contatos", description: error.message, variant: "destructive" });
        }
    };

    const totalPages = Math.ceil(totalContacts / itemsPerPage);

    const handleFilterChange = useCallback((name, value) => {
        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };
            const filterPayload = {};

            if (name === 'country') {
                newFilters.state = '';
                newFilters.city = '';
                if(value) filterPayload.country = value;
            } else if (name === 'state') {
                newFilters.city = '';
                filterPayload.country = newFilters.country;
                if(value) filterPayload.state = value;
            } else {
                 filterPayload.country = newFilters.country;
                 filterPayload.state = newFilters.state;
            }
            
            loadDropdownOptions(filterPayload);
            return newFilters;
        });
    }, [loadDropdownOptions]);

    useEffect(() => {
        setCurrentPage(1);
        loadContacts();
    }, [filters]);

    return {
        contacts,
        filteredContacts: contacts,
        totalContacts,
        selectedContacts,
        filters,
        currentPage,
        itemsPerPage,
        editingContact,
        showBulkActions,
        bulkActionData,
        professions,
        branches,
        loading,
        setCurrentPage,
        handleSelectContact,
        handleSelectAll,
        handleEditContact,
        handleSaveContact,
        handleDeleteContact,
        setShowBulkActions,
        setBulkActionData,
        handleBulkUpdate,
        handleBulkDelete,
        exportContacts,
        setEditingContact,
        totalPages,
        uniqueCountries: dropdownOptions.uniqueCountries,
        uniqueStates: dropdownOptions.uniqueStates,
        uniqueCities: dropdownOptions.uniqueCities,
        uniqueProfessions: dropdownOptions.uniqueProfessions,
        uniqueBranches: dropdownOptions.uniqueBranches,
        handleFilterChange,
    };
};