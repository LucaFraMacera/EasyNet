# EasyNet
### Semplice Web App per creare e visualizzare grafi, e applicarci algoritmi.
## _Crea_
Basta un _*click*_ per crare nuovi nodi ed aggiungere nuovi archi. E' possibile anche impostare varie proprietà per il proprio grafo quali:
+ Scegliere se gli archi siano orientati o non orientati;
+ Scegliere se gli archi siano pesati o non pesati;
+ Scegliere se il grafo sia bipartito o non.
## _Visualizza_
Usando la libreria [Vis-Networks](https://visjs.github.io/vis-network/docs/network/) è possibile visualizzare i propri grafi in maniera semplice ed efficente.
E' possibile muovere i nodi presenti in modo da decidere la forma del proprio grafo e spostare la visualizzazione nell'area pre-impostata in modo da poter controllare pienamente ciò che si sta creando.
## _Lavora_
Una volta creato il grafo, è possibile applicare e visualizzare il risultato di varie implementazioni personali di famosi algoritmi, quali:
+ ***Dijkstra*** per trovare
  + _Albero dei Cammini Minimi_ da un nodo prescelto;
  + _Cammino Minimo_ tra due nodi selezionati.
+ ***Prim*** per trovare il _Minimo Albero Ricoprente_ usando un applicazione dell'algoritmo _`Greedy`_
+ ***Kruskal*** per trovare il _Minimo Albero Ricoprente_ usando un implementazione personale di una struttura _`Union-Find`_
  <!-- + ***Floyd & Warhall*** per trovare le minime distanze tra ogni coppia di nodi nel grafo -->
## _Salva e continua..._
Una volta finito il proprio lavoro è possibile salvare la struttura del proprio grafo localmente e riusarla nel futuro.
