import { supabase } from '@/lib/supabaseClient';
import { extractInfoFromEmail, isValidEmail } from '@/lib/nameExtractor.utils';
import { toast } from '@/components/ui/use-toast';

export const processFile = async ({ file, defaultData, onProgress }) => {
  const text = await file.text();
  const lines = text.split(/[\n\r]+/).map(line => line.trim()).filter(Boolean);
  const totalLines = lines.length;

  if (totalLines === 0) {
    throw new Error("O arquivo não contém dados válidos para processar.");
  }

  const uniqueEmails = new Map();
  let suspiciousCount = 0;
  let duplicatesInFile = 0;

  const CHUNK_SIZE = 100;
  for (let i = 0; i < totalLines; i += CHUNK_SIZE) {
    const chunk = lines.slice(i, i + CHUNK_SIZE);
    chunk.forEach(line => {
      const parts = line.split(';');
      const email = (parts[0] || '').trim().toLowerCase();
      if (!email || !email.includes('@')) return;

      if (!isValidEmail(email)) {
        suspiciousCount++;
        return;
      }

      if (uniqueEmails.has(email)) {
        duplicatesInFile++;
      } else {
        uniqueEmails.set(email, {
          country: (parts[1] || '').trim() || null,
          state: (parts[2] || '').trim() || null,
          city: (parts[3] || '').trim() || null,
          profession: (parts[4] || '').trim() || null,
          branch: (parts[5] || '').trim() || null,
        });
      }
    });

    onProgress({ processed: i + chunk.length, total: totalLines });
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  const extractedData = Array.from(uniqueEmails.entries()).map(([email, data]) => {
    const { name, website } = extractInfoFromEmail(email);
    return {
      name,
      email,
      website,
      country: data.country || defaultData.country || null,
      state: data.state || null,
      city: data.city || null,
      profession: data.profession || defaultData.profession || null,
      branch: data.branch || defaultData.branch || null,
    };
  });

  const stats = {
    totalLines: totalLines,
    processedEmails: extractedData.length,
    duplicatesRemoved: duplicatesInFile,
    suspiciousRemoved: suspiciousCount,
    extractedNames: extractedData.filter(item => item.name !== 'N/A').length,
    failedExtractions: extractedData.filter(item => item.name === 'N/A').length
  };

  return { extractedData, stats };
};

export const importContacts = async ({ contacts, userId, onProgress }) => {
  const contactsToProcess = contacts;
  let optedOut = 0;

  if (contactsToProcess.length === 0) {
    toast({ title: "Nenhum novo contato para importar." });
    return { totalInserted: 0, totalUpdated: 0, optedOut: 0, totalProcessed: 0 };
  }

  const { data: optOutData, error: optOutError } = await supabase.from('opt_out_emails').select('email, type').eq('user_id', userId);
  if (optOutError) throw optOutError;
  const optOutEmails = new Set(optOutData.filter(item => item.type === 'email').map(item => item.email));
  const optOutDomains = new Set(optOutData.filter(item => item.type === 'domain').map(item => item.email));
  
  const contactsToUpsert = [];
  contactsToProcess.forEach(contact => {
    const email = contact.email.toLowerCase();
    const domain = email.split('@')[1];
    if (optOutEmails.has(email) || (domain && optOutDomains.has(domain))) {
      optedOut++;
    } else {
      contactsToUpsert.push({
        email: email,
        name: contact.name,
        country: contact.country,
        state: contact.state,
        city: contact.city,
        website: contact.website,
        profession: contact.profession,
        branch: contact.branch,
        import_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    }
  });

  if(contactsToUpsert.length === 0) {
    onProgress({ processed: contactsToProcess.length, total: contactsToProcess.length });
    return { totalInserted: 0, totalUpdated: 0, optedOut, totalProcessed: contactsToProcess.length };
  }
  
  let totalInserted = 0;
  let totalUpdated = 0;
  const CHUNK_SIZE = 500;

  for (let i = 0; i < contactsToUpsert.length; i += CHUNK_SIZE) {
    const chunk = contactsToUpsert.slice(i, i + CHUNK_SIZE);
    
    const { data: report, error } = await supabase.rpc('upsert_and_report_contacts', {
      contacts_data: chunk,
      p_user_id: userId
    });
    
    if (error) {
      console.error("Supabase upsert error:", error);
      throw new Error(`Falha ao inserir lote: ${error.message}`);
    }
    
    totalInserted += report.inserted || 0;
    totalUpdated += report.updated || 0;
    onProgress({ processed: i + chunk.length + optedOut, total: contactsToProcess.length });
  }
  
  onProgress({ processed: contactsToProcess.length, total: contactsToProcess.length });

  return { totalInserted, totalUpdated, optedOut, totalProcessed: contactsToProcess.length };
};