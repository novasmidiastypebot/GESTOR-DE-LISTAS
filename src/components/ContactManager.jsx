import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContactManager } from '@/hooks/useContactManager';
import ContactHeader from '@/components/contact-manager/ContactHeader';
import ContactFilters from '@/components/contact-manager/ContactFilters';
import ContactTable from '@/components/contact-manager/ContactTable';
import Pagination from '@/components/contact-manager/Pagination';
import EditContactModal from '@/components/contact-manager/EditContactModal';
import BulkActionsModal from '@/components/contact-manager/BulkActionsModal';
import { Loader2 } from 'lucide-react';

const ContactManager = () => {
  const {
    contacts,
    filteredContacts,
    selectedContacts,
    filters,
    currentPage,
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
    getCurrentPageContacts,
    totalPages,
    uniqueCountries,
    uniqueStates,
    uniqueCities,
    uniqueProfessions,
    uniqueBranches,
    handleFilterChange,
  } = useContactManager();

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ContactHeader
        filteredCount={filteredContacts.length}
        totalCount={contacts.length}
        selectedCount={selectedContacts.length}
        onExport={exportContacts}
        onBulkEdit={() => setShowBulkActions(true)}
        onBulkDelete={handleBulkDelete}
        isFiltered={Object.values(filters).some(v => v !== '')}
      />
      
      <ContactFilters 
        filters={filters}
        handleFilterChange={handleFilterChange}
        uniqueCountries={uniqueCountries}
        uniqueStates={uniqueStates}
        uniqueCities={uniqueCities}
        uniqueProfessions={uniqueProfessions}
        uniqueBranches={uniqueBranches}
      />
      
      <ContactTable
        contacts={getCurrentPageContacts()}
        selectedContacts={selectedContacts}
        onSelectContact={handleSelectContact}
        onSelectAll={handleSelectAll}
        onEditContact={handleEditContact}
        onDeleteContact={handleDeleteContact}
        currentPageContacts={getCurrentPageContacts()}
        loading={loading}
      />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AnimatePresence>
        {editingContact && (
          <EditContactModal
            contact={editingContact}
            setContact={setEditingContact}
            onSave={handleSaveContact}
            onCancel={() => setEditingContact(null)}
            professions={professions}
            branches={branches}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBulkActions && (
          <BulkActionsModal
            selectedCount={selectedContacts.length}
            filteredCount={filteredContacts.length}
            bulkData={bulkActionData}
            setBulkData={setBulkActionData}
            onSave={handleBulkUpdate}
            onCancel={() => setShowBulkActions(false)}
            professions={professions}
            branches={branches}
          />
        )}
      </AnimatePresence>

      {filteredContacts.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Nenhum contato encontrado
          </h3>
          <p className="text-white/70">
            {contacts.length === 0 
              ? 'Importe alguns contatos para começar a gerenciar sua base de dados.'
              : 'Tente ajustar os filtros para encontrar os contatos desejados.'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ContactManager;