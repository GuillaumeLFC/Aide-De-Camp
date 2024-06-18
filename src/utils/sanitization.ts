/**
 * Fonction rajoutant un \ devant les caractères ambigus pour minimiser le risque d'erreur
**/
export function sanitizeStringJS(input:string | null) : string | null {
  return input ? input.replace(/["'\\]/g, '\\$&') : null;
}
