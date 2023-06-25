const descriptionZone = document.querySelector("#description") as HTMLLabelElement;
const ouputDescription = document.querySelector("#outDescription") as HTMLLabelElement;
const DEFAULT = "Aggiungi nodi e archi"
const DELETE_DESCR =  "Clicca su un nodo o su un arco per eliminarlo. "+
                        "Per annullare l'operazione clicca il bottone 'Annulla'"
const ADD_EDGE = "Clicca sul nodo di partenza e trascina fino al nodo che vuoi collegare. Clicca 'Annulla' per impedire la creazione del nuovo arco"
const EDIT_EDGE = "Cambia il peso o le informazioni dell'arco selezionato. Clicca 'Annulla' per annullare l'operazione"
const algoritmsDescriptions = {
    dijkstra : "Risultato dell'esecuzione dell'algoritmo di Dikstra",
    prim : "Minimo Albero Ricoprente calcolato con Prim",
    kruskal : "Minimo Albero Ricoprente calcolato con Kruskal"
}
export const algorithms={
    DIJKSTRA: "DIJKSTRA",
    PRIM:"PRIM",
    KRUSKAL:"KRUSKAL"
}
export const descriptions = {
    DEFAULT:"DEFAULT",
    DELETE:"DELETE",
    ADD_EDGE:"ADDE",
    EDIT_EDGE:"EDITE"
}
export function setDefaultDescription(){
    descriptionZone.innerText = DEFAULT
}
export function setDescription(value:String){
    switch(value){
        default:
            descriptionZone.textContent = DEFAULT
            break
        case descriptions.DELETE:
            descriptionZone.textContent = DELETE_DESCR
            break
        case descriptions.ADD_EDGE:
            descriptionZone.textContent = ADD_EDGE
            break
        case descriptions.EDIT_EDGE:
            descriptionZone.textContent = EDIT_EDGE
            break
    }
}
export function setOutputDescription(which:string){
    switch(which){
        default:
            ouputDescription.textContent = ""
            break
        case algorithms.DIJKSTRA:
            ouputDescription.textContent = algoritmsDescriptions.dijkstra
            break
        case algorithms.PRIM:
            ouputDescription.textContent = algoritmsDescriptions.prim
            break
        case algorithms.KRUSKAL:
            ouputDescription.textContent = algoritmsDescriptions.kruskal
            break
    }
}