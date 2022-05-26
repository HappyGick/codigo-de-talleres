// estructura de los grafos
interface Grafo {
    [vertice: string]: string[]
};

interface GrafoPonderado {
    [vertice: string]: [string, number][]
};

// Funciones de teoría de conjuntos (esencial)
function esVacio(a: string[]) {
    return a.length === 0;
}

function unir(a: string[], b: string[]): string[] {
    return a.concat(b);
}

function intersectar(a: string[], b: string[]): string[] {
    return a.filter(v => b.includes(v));
}

/**
 * a - b
 * */
function diferencia(a: string[], b: string[]): string[] {
    return a.filter(v => !b.includes(v));
}

//Teoría de grafos basica
function quitarVertice(G: Grafo, v: string) {
    if (G[v]) {
        let conexiones: string[] = [...G[v]];
        delete G[v];
        for (const c of conexiones) {
            G[c] = G[c].filter(x => x !== v);
        }
    }
}

function agregarArista(G: Grafo, v1: string, v2: string) {
    if (!G[v1].includes(v2)) G[v1].push(v2);
    if (!G[v2].includes(v1)) G[v2].push(v1);
}

function agregarVertice(G: Grafo, v: string, conexiones: string[]) {
    if(!G[v]) G[v] = [];
    for (const c of conexiones) {
        agregarArista(G, v, c);
    }
}

function quitarVerticePonderado(G: GrafoPonderado, v: string) {
    if (G[v]) {
        let conexiones: [string, number][] = [...G[v]];
        delete G[v];
        for (const [vc, pc] of conexiones) {
            G[vc] = G[vc].filter(([c, p]) => c !== v);
        }
    }
}

function agregarVerticePonderado(G: GrafoPonderado, v: string, conexiones: [string, number][]) {
    G[v] = [...conexiones];
    for (const [vc, pc] of conexiones) {
        G[vc].push([vc, pc]);
    }
}

function recorrer(G: Grafo, vInicial: string, visitados: string[]) {
    visitados.push(vInicial);
    for (const v of G[vInicial]) {
        if(!visitados.includes(v)) {
            recorrer(G, v, visitados);
        }
    }
}

function recorrerPonderado(G: GrafoPonderado, vInicial: string, visitados: string[]) {
    visitados.push(vInicial);
    for (const [v, p] of G[vInicial]) {
        if(!visitados.includes(v)) {
            recorrerPonderado(G, v, visitados);
        }
    }
}

function getNumCC(G: Grafo): number {
    let V: string[] = Object.keys(G);
    let CC = 0;
    if (!esVacio(V)) {
        let recorridos: string[] = [];
        let faltantes: string[] = [...V];
        while(!esVacio(faltantes)) {
            let vInicial = faltantes[0];
            CC += 1;
            recorrer(G, vInicial, recorridos);
            faltantes = diferencia(V, recorridos);
        }
    }
    return CC;
}

function getVerticesDeCorte(G: Grafo): string[] {
    let copiaGrafo: Grafo = {...G};
    let V = Object.keys(G);
    let verticesDeCorte: string[] = [];
    let CCGrafo = getNumCC(G);
    for (const v of V) {
        quitarVertice(copiaGrafo, v);
        if(getNumCC(copiaGrafo) > CCGrafo) verticesDeCorte.push(v);
        copiaGrafo = {...G};
    }
    return verticesDeCorte;
}

// calcula el arbol minimo cobertor de un grafo ponderado G
// usando el algoritmo de Prim
function arbolMinimoCobertor(G: GrafoPonderado): Grafo {
    let T: Grafo = {};
    let V: string[] = Object.keys(G);
    let B: string[] = [V[0]];

    for(const v of V) {
        T[v] = [];
    }

    while(B.length !== V.length) {
        let verticesRestantes: string[] = diferencia(V, B);
        let aristaMenor: [string, string, number] = ['', '', Infinity];
        for (const v of B) {
            for (const [vc, pc] of G[v]) {
                if (verticesRestantes.includes(vc) && pc < aristaMenor[2]) {
                    aristaMenor = [v, vc, pc];
                }
            }
        }
        agregarArista(T, aristaMenor[0], aristaMenor[1]);
        B.push(aristaMenor[1]);
    }

    return T;
}

(function main(){
    let G: Grafo = {
        '1': ['2', '3', '6'],
        '2': ['1'],
        '3': ['1'],
        '4': ['5', '7'],
        '5': ['4'],
        '6': ['1'],
        '7': ['4']
    }

    let Gp: GrafoPonderado = {
        '1':[['2', 1],['3', 5],['4', 10]],
        '2':[['1', 1],['3', 6],['5', 7]],
        '3':[['1', 5],['2', 6],['4', 4],['5', 1],['6', 8]],
        '4':[['1', 10],['3', 4]],
        '5':[['2', 7],['3', 1],['7', 1]],
        '6':[['3', 8],['7', 10]],
        '7':[['6', 10],['5', 1]],
    }

    let Gp2: GrafoPonderado = {
        '1':[['4', 1],['6', 11],['5', 10],['3', 2]],
        '2':[['3', 1],['5', 3]],
        '3':[['1', 2],['5', 6],['2', 1]],
        '4':[['1', 1],['6', 10]],
        '5':[['6', 4],['1', 10],['3', 6],['2', 3]],
        '6':[['4', 10],['1', 11],['5', 4]]
    }

    console.log(getNumCC(G) === 2);
    console.log(getVerticesDeCorte(G).length === 2);
    console.log(arbolMinimoCobertor(Gp));
    console.log(arbolMinimoCobertor(Gp2));
})();