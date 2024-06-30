/**
 * Throw une erreur si l'objet fourni est null ou undefined.
 *
 * Cette fonction utilitaire permet de s'assurer que l'objet donné n'est ni null ni undefined. 
 * Si l'objet est null ou undefined, elle trow une erreur avec le message d'erreur fourni. 
 * Cela est utile pour valider les paramètres requis et prévenir les erreurs de référence null.
 *
 * @template Type - Le type attendu de l'objet.
 * @param  - L'objet à vérifier pour null ou undefined.
 * @param  - Le message d'erreur à throw si l'objet est null ou undefined.
 * @returns - L'objet non null.
 * @throws - une erreur si l'objet est null ou undefined.
 */
export function throwErrorIfNull <Type> (object : Type | null | undefined, errorMessage : string){
  if (object === null || object === undefined){
    throw new Error(errorMessage);
  }
  return object;
}

