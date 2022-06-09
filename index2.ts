class Nodo {
    valor: number;
    izq?: Nodo;
    der?: Nodo;

    constructor(_valor: number) {
        this.valor = _valor;
    }

    public insertar(obj: Nodo) {
        if(obj.valor < this.valor) {
            if(this.izq) {
                this.izq.insertar(obj);
            } else {
                this.izq = obj;
            }
        } else if (obj.valor > this.valor) {
            if(this.der) {
                this.der.insertar(obj);
            } else {
                this.der = obj;
            }
        }
    }

    menorValor(): number {
        if(this.izq) {
            return this.izq.menorValor();
        } else {
            return this.valor;
        }
    }

    eliminarAux(obj: Nodo, padre: Nodo) {
        if(obj.valor > this.valor) {
            if (this.der) {
               this.der.eliminarAux(obj, this);
            }
        } else if(obj.valor < this.valor) {
            if (this.izq) {
                this.izq.eliminarAux(obj, this);
            }
        } else {
            if (this.izq && this.der) {
                this.valor = this.der.menorValor();
                this.der.eliminarAux(obj, this);
            } else {
                if(padre.der) {
                    if(padre.der.valor === this.valor) {
                        padre.der = this.izq ? this.izq : this.der;
                    }
                }

                if (padre.izq) {
                    if(padre.izq.valor === this.valor) {
                        padre.izq = this.izq ? this.izq : this.der;
                    }
                }
            }
        }
    }

    public eliminar(obj: Nodo) {
        if(obj.valor > this.valor) {
            if (this.der) {
               this.der.eliminarAux(obj, this);
            }
        } else if(obj.valor < this.valor) {
            if (this.izq) {
                this.izq.eliminarAux(obj, this);
            }
        }
    }
    
    public imprimir() {
        if(!this.der && !this.izq) return;
        console.log(this.valor);
        let s = (this.izq ? 'izq: ' + this.izq.valor + ' ' : '') + (this.der ? 'der: ' + this.der.valor + ' ' : '');
        console.log(s);
        if(this.izq) this.izq.imprimir();
        if(this.der) this.der.imprimir();
    }
}

type Arbol = Nodo;

(function main() {
    let a: Arbol = new Nodo(10);

    a.insertar(new Nodo(15));
    a.insertar(new Nodo(6));
    a.insertar(new Nodo(7));
    a.insertar(new Nodo(5));
    a.insertar(new Nodo(11));

    a.imprimir();

    a.eliminar(new Nodo(6));
    console.log('-----------------');

    a.imprimir();
})();