import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const isValidDomain = (value) => {
  return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) && !value.includes('@');
};

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const useOptOut = () => {
  const { user } = useAuth();
  const [optOutList, setOptOutList] = useState([]);
  const [totalOptOutCount, setTotalOptOutCount] = useState(0);
  const [newItem, setNewItem] = useState('');
  const [bulkItems, setBulkItems] = useState('');
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchOptOutCount = useCallback(async () => {
    if (!user) return;
    const { count, error } = await supabase
      .from('opt_out_emails')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (error) {
      console.error("Error fetching opt out count:", error);
    } else {
      setTotalOptOutCount(count);
    }
  }, [user]);

  const fetchOptOutList = useCallback(async () => {
    if (!user) return;
    // Fetch only a sample for display
    const { data, error } = await supabase
      .from('opt_out_emails')
      .select('email, type')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) {
      toast({ title: "Erro ao buscar lista", description: error.message, variant: "destructive" });
    } else {
      setOptOutList(data);
    }
    await fetchOptOutCount();
  }, [user, fetchOptOutCount, toast]);

  useEffect(() => {
    if(user) {
      fetchOptOutList();
    }
  }, [user, fetchOptOutList]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    const itemToAdd = newItem.trim().toLowerCase();
    if (!itemToAdd) return;

    const type = isValidEmail(itemToAdd) ? 'email' : isValidDomain(itemToAdd) ? 'domain' : null;

    if (!type) {
      toast({ title: "Entrada inválida ⚠️", description: "Por favor, insira um e-mail ou domínio válido.", variant: 'destructive' });
      return;
    }

    if (optOutList.some(item => item.email === itemToAdd)) {
      toast({ title: "Item já existe ⚠️", description: `${itemToAdd} já está na lista.`, variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('opt_out_emails').insert([{ email: itemToAdd, user_id: user.id, type, created_at: new Date().toISOString() }]);
    if (error) {
      toast({ title: "Erro ao adicionar", description: error.message, variant: "destructive" });
    } else {
      await fetchOptOutList();
      setNewItem('');
      toast({ title: `${type === 'email' ? 'E-mail' : 'Domínio'} adicionado ✅`, description: `${itemToAdd} foi adicionado à lista de opt-out.` });
    }
  };

  const processAndAddItems = async (itemsToAdd) => {
    if (itemsToAdd.length === 0) {
      toast({ title: "Nenhum item para adicionar.", description: "A lista fornecida estava vazia.", variant: 'destructive' });
      return;
    }

    const recordsToInsert = itemsToAdd
      .map(item => {
        const value = item.trim().toLowerCase();
        if (!value) return null;
        const type = isValidEmail(value) ? 'email' : isValidDomain(value) ? 'domain' : null;
        if (!type) return null;
        return { email: value, user_id: user.id, type, created_at: new Date().toISOString() };
      })
      .filter(Boolean);
    
    const { data: existing, error: fetchError } = await supabase.from('opt_out_emails').select('email').in('email', recordsToInsert.map(r => r.email));
    if (fetchError) {
      toast({ title: "Erro ao verificar itens existentes", description: fetchError.message, variant: "destructive" });
      return;
    }

    const existingEmails = new Set(existing.map(e => e.email));
    const uniqueNewItems = recordsToInsert.filter(record => !existingEmails.has(record.email));

    if (uniqueNewItems.length > 0) {
      const { error } = await supabase.from('opt_out_emails').insert(uniqueNewItems);

      if (error) {
        toast({ title: "Erro ao adicionar lista", description: error.message, variant: "destructive" });
      } else {
        await fetchOptOutList();
        const duplicatesCount = itemsToAdd.length - uniqueNewItems.length;
        toast({ title: "Lista de Opt-out Atualizada! 🎉", description: `${uniqueNewItems.length} novos itens adicionados. ${duplicatesCount > 0 ? `${duplicatesCount} duplicados ou inválidos ignorados.` : ''}` });
      }
    } else {
      toast({ title: "Nenhum item novo ⚠️", description: `Todos os itens fornecidos já estão na lista ou são inválidos.`, variant: 'destructive' });
    }
  };

  const handleBulkAdd = () => {
    const itemsToAdd = bulkItems.split(/[\n,;]+/).filter(Boolean);
    processAndAddItems(itemsToAdd);
    setBulkItems('');
  };

  const handleRemoveItem = async (itemToRemove) => {
    const { error } = await supabase.from('opt_out_emails').delete().match({ email: itemToRemove.email, user_id: user.id });
    if (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    } else {
      await fetchOptOutList();
      toast({ title: "Item removido!", description: `${itemToRemove.email} foi removido da lista.` });
    }
  };
  
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const validExtensions = ['.csv', '.txt'];
      const hasValidExtension = validExtensions.some(ext => uploadedFile.name.toLowerCase().endsWith(ext));
      if (hasValidExtension) {
        setFile(uploadedFile);
        setProgress(0);
        setProcessedCount(0);
        setTotalCount(0);
        toast({ title: "Arquivo carregado! 📁", description: `${uploadedFile.name} está pronto para ser processado.` });
      } else {
        toast({ title: "Formato inválido ❌", description: "Por favor, selecione um arquivo CSV ou TXT.", variant: "destructive" });
      }
    }
  };

  const processOptOutFile = async () => {
    if (!file) {
      toast({ title: "Nenhum arquivo selecionado ⚠️", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const text = await file.text();
      const itemsToAdd = text.split(/[\n,;]+/).filter(Boolean);
      setTotalCount(itemsToAdd.length);
      await processAndAddItems(itemsToAdd);
      
      setFile(null);
      
    } catch (error) {
      toast({ title: "Erro ao ler o arquivo ❌", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const exportOptOuts = async () => {
    toast({ title: "Iniciando exportação de Opt-outs...", description: "Isso pode levar alguns instantes." });
    try {
        const CHUNK_SIZE = 1000;
        let allOptOuts = [];
        let startIndex = 0;
        let hasMore = true;

        while (hasMore) {
            const { data, error } = await supabase
                .from('opt_out_emails')
                .select('email,type')
                .eq('user_id', user.id)
                .range(startIndex, startIndex + CHUNK_SIZE - 1);

            if (error) throw error;

            if (data.length > 0) {
                allOptOuts = allOptOuts.concat(data);
                startIndex += CHUNK_SIZE;
            } else {
                hasMore = false;
            }
        }

        if (allOptOuts.length === 0) {
            toast({ title: "Nenhum item de opt-out para exportar.", variant: "destructive" });
            return;
        }

        const csvContent = [
            ['email', 'type'].join(','),
            ...allOptOuts.map(item => [item.email, item.type].map(field => `"${field || ''}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `opt-out-list_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        toast({ title: "Exportação de Opt-outs concluída! 📥", description: `${allOptOuts.length} itens exportados.` });

    } catch (error) {
        toast({ title: "Erro ao exportar Opt-outs", description: error.message, variant: "destructive" });
    }
};

  return {
    optOutList,
    totalOptOutCount,
    newItem,
    setNewItem,
    bulkItems,
    setBulkItems,
    file,
    isProcessing,
    progress,
    processedCount,
    totalCount,
    handleAddItem,
    handleBulkAdd,
    handleRemoveItem,
    handleFileUpload,
    processOptOutFile,
    exportOptOuts,
  };
};