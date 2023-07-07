const DB_NAME = "easyNETDataBase"
const schema = "networks"
let connection = null as IDBDatabase
type SchemaElement ={
    nome:string,
    info:{
        isWeighted:boolean,
        isDirected:boolean,
        isBipartite:boolean
    }
    data:{
        edges:any[]
        nodes:any[]
    }
}
export async function openConnection():Promise<boolean>{
    return new Promise((res,rej)=>{
        let request = indexedDB.open(DB_NAME,3)
        request.onerror= error =>{
            console.error(error)
            rej(false)
        }
        request.onsuccess = success =>{
            let target = success.target as any
            connection = target.result
            res(true)
        }
        request.onupgradeneeded = (success)=>{
            let target = success.target as any
            connection = target.result
            connection.createObjectStore(schema, { keyPath: "nome" })
        }
    })
}


export async function getAllNetworks():Promise<SchemaElement[]>{
    return new Promise(async (res,rej)=>{
        connection = await getConnection()
        let result = connection.transaction(schema).objectStore(schema).getAll()
        result.onsuccess = data =>{
            let target = data.target as any
            res(target.result)
        }
        result.onerror = error=>{
            rej(error)
        }
    })
}

export async function addNetwork(data:SchemaElement):Promise<boolean>{
    return new Promise(async (res,rej)=>{
       connection = await getConnection()
       let request = connection.transaction(schema,"readwrite").objectStore(schema).add(data)
       request.onerror=error=>{
           rej(error)
       }
       request.onsuccess= ()=>{
           res(true)
       }
    })
}
export async function updateNetwork(data:SchemaElement):Promise<boolean>{
    return new Promise(async (res,rej)=>{
        connection = await getConnection()
        let query = connection.transaction(schema,"readwrite").objectStore(schema).put(data)
        query.onerror = error=>rej(error)
        query.onsuccess = ()=>res(true)
    })
}
async function getConnection():Promise<IDBDatabase>{
    return new Promise((res,rej)=>{
        let openRequest = indexedDB.open(DB_NAME,3)
        openRequest.onerror = error=>{
            rej(null)
        }
        openRequest.onsuccess = success =>{
            let target = success.target as any
            res(target.result)
        }
    })
}