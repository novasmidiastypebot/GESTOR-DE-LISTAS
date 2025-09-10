import { commonNames, genericDomains } from '@/lib/name-extractor/constants';

export const isValidEmail = (email) => {
  if (!email || email.length > 100) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  const localPart = email.split('@')[0];
  // Check for long hexadecimal strings (like hashes)
  const hashRegex = /^[a-f0-9]{32,}$/i;
  if (hashRegex.test(localPart)) return false;

  return true;
};

const capitalize = (s) => {
    if (typeof s !== 'string' || s.length === 0) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const extractFirstName = (str, isGenericDomain) => {
    const foundName = commonNames.find(name => str.startsWith(name));
    if (foundName) {
        return capitalize(foundName);
    }
    
    // Se não encontrou um nome comum e o domínio é genérico, retorna o próprio `str` capitalizado.
    if (isGenericDomain && str.length > 1 && isNaN(str)) {
        return capitalize(str);
    }
    
    return null;
};

export const extractInfoFromEmail = (email) => {
  try {
    const defaultReturn = { name: 'N/A', website: null };
    if (!email) return defaultReturn;

    const [localPart, domain] = email.toLowerCase().split('@');
    if (!localPart || !domain) return defaultReturn;

    const isGenericDomain = genericDomains.some(d => domain.endsWith(d));
    const website = isGenericDomain ? null : `https://${domain}`;
    
    const result = { name: 'N/A', website: website };

    let cleanLocal = localPart.replace(/[0-9]/g, '');
    const hasSeparators = /[._-]/.test(cleanLocal);
    
    if (hasSeparators) {
      const nameParts = cleanLocal.split(/[._-]/).filter(part => isNaN(part) && part.length > 1);
      if (nameParts.length > 0) {
        const potentialName = extractFirstName(nameParts[0], isGenericDomain);
        if (potentialName) {
            result.name = nameParts.map(p => capitalize(p)).join(' ');
            return result;
        }
      }
    } 
    
    const firstName = extractFirstName(cleanLocal, isGenericDomain);
    if (firstName) {
      result.name = firstName;
      return result;
    }
    
    if (!isGenericDomain) {
      const domainParts = domain.split('.');
      const mainDomain = domainParts[0];
      if (mainDomain.length >= 2) {
        result.name = capitalize(mainDomain);
        return result;
      }
    }

    if (cleanLocal.length >= 2) {
      result.name = capitalize(cleanLocal);
      return result;
    }
    
    return result;
    
  } catch (error) {
    return { name: 'N/A', website: null };
  }
};