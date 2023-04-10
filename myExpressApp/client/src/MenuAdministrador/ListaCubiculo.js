import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import './ListaCubiculo.css';
import '../Tarjeta.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'

let listaCompleta = [];
const reactivarCubiculo = 'Puede volver a activar el cubiculo desde el menú de edición';

export default () => {
    useEffect(() => {
        axios.get('http://localhost:3001/cubiculos').then((response) => {
            try {
                listaCompleta = response.data;
            } catch (error) {
                alert('Ocurrió un error al cargar la información');
            }
            generarPagina(1, porPagina, true, '');
        })
    },
    []);

    const opcionesPorPagina = [10, 20, 30, 50];
    const [lista, setLista] = useState(null);
    const [porPagina, setPorPagina] = useState(opcionesPorPagina[0]);
    const [paginas, setPaginas] = useState(1);
    const [pagina, setPagina] = useState(1);
    const [filtro, setFiltro] = useState(null);
    const [totalElementos, setTotalElementos] = useState(null);

    let listaFiltrada = [];

    const funcionFiltro = (elemento, nuevoFiltro) => {
        const servicios = elemento.servicios.map(servicio => servicio.toLowerCase()).join(" ");
        return (elemento.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(nuevoFiltro.toLowerCase()) != -1
                || elemento.nombre.toLowerCase().indexOf(nuevoFiltro.toLowerCase()) != -1
                || elemento.estado.toLowerCase().indexOf(nuevoFiltro.toLowerCase()) != -1
                || elemento.capacidad.toString().indexOf(nuevoFiltro) != -1
                || servicios.indexOf(nuevoFiltro.toLowerCase()) != -1);
               // ||for i in elemento.servicios: elemento.servicios.toLowerCase().indexOf(nuevoFiltro.toLowerCase()) != -1)
    };

    const generarPagina = (nuevaPagina = pagina, tamano = porPagina, forzar = false, nuevoFiltro = filtro) => {
        if (nuevaPagina < 1) {
            nuevaPagina = 1;
        } else if (nuevaPagina > paginas) {
            nuevaPagina = paginas;
        }

        if (pagina != nuevaPagina || tamano != porPagina || forzar || nuevoFiltro != filtro) {
            if (nuevoFiltro != filtro) {
                setFiltro(nuevoFiltro);
                nuevaPagina = 1;
            }
            if (!nuevoFiltro) {
                listaFiltrada = listaCompleta.slice(0, listaCompleta.length);
            } else {
                listaFiltrada = listaCompleta.filter((e) => {return funcionFiltro(e, nuevoFiltro)})
            }
            setPaginas((Math.ceil(listaFiltrada.length / tamano) < 1) ? 1 : Math.ceil(listaFiltrada.length / tamano));
            setTotalElementos(listaFiltrada.length);
            setPagina(nuevaPagina);
            let inicio = tamano * (nuevaPagina - 1);
            let fin = tamano * nuevaPagina;
            setLista(listaFiltrada.slice(
                inicio,
                (fin <= listaFiltrada.length) ? fin : listaFiltrada.length
                /* Lo anterior es para devolver el índice del último elemento en caso de que no haya más */
            ));
            let elementoLista = document.getElementById("lista");
            if (elementoLista) {
                elementoLista.scrollTop = 0;
            }
        } else {
            setPagina(nuevaPagina);
        }
    };

    const cambiarTamano = (tamanoNuevo) => {
        setPorPagina(tamanoNuevo);
        setPaginas(Math.ceil(listaFiltrada.length / tamanoNuevo));
        let indice = porPagina * (pagina - 1) // índice del primer elemento de la página actual
        generarPagina(Math.floor(indice / tamanoNuevo) + 1, tamanoNuevo, false, filtro);
    }

    const desactivarCubiculo = (idCubiculo) => {       
        for (let i = 0; i < listaCompleta.length; i++) {
            if (listaCompleta[i].id == idCubiculo) {
                listaCompleta[i].estado = 'Eliminado';
                break;
            }
        }
    }

    return (
        <div className="tarjeta Lista-Cubiculos">
            <h1>Gestión de cubiculos</h1>
            { (lista) ? (
                <div className="filtros">
                    <div className="filtro">
                        <label for="filtroInput">Buscar:</label>
                        <input className="form-control" onChange={e => generarPagina(pagina, porPagina, false, e.target.value)} type="text" id="filtroInput" placeholder="Nombre, estado, capacidad o servicios" value={filtro}></input>
                    </div>
                    <div className="filtro">
                        <label for="porPaginaSelect">Resultados por página: </label>
                        <select id="porPaginaSelect" onChange={e => {cambiarTamano(e.target.value);setPorPagina(e.target.value);}}>
                            {(opcionesPorPagina.map((o) => (<option value={o}>{o}</option>)))}
                        </select>
                    </div>
                    <div className="filtro">
                        <label for="paginaInput">Página</label>
                        <a href="javascript:void(0);" onClick={e => {generarPagina(pagina -1)}}>←</a>
                        <input className="form-control" onChange={e => {generarPagina((e.target.value >= 1 && e.target.value <= paginas) ? e.target.value : pagina)}} type="number" id="paginaInput" min={1} max={paginas} value={pagina}></input>
                        <a href="javascript:void(0);" onClick={e => {generarPagina(pagina + 1)}}>→</a>
                        <p>/ {paginas}</p>
                    </div>
                </div>
            ) : (<p></p>)}
            { (lista) ? (
                <div className="lista" id="lista">
                    {lista.map((e) => (
                        <div className="cubiculo">
                            <div className="datos">
                                <div className="nombre">
                                    {e.nombre}
                                </div>
                                <div className="otros-datos">
                                    <p><b>Estado:</b> {e.estado} <b>· Capacidad:</b> {e.capacidad} <b>· Servicios Especiales:</b> {e.servicios}</p>
                                </div>
                            </div>
                            <div className="opciones">
                                <FontAwesomeIcon className="iconoOpcion desactivado" icon={faEye} title="Ver historial" />
                                <FontAwesomeIcon className="iconoOpcion desactivado" icon={faPenToSquare} title="Modificar Cubiculo" />
                                {(e.estado) ? (
                                    <FontAwesomeIcon className="iconoOpcion" icon={faTrashCan} title="Borrar Cubiculo" onClick={() => {
                                        if (window.confirm('¿Desea Borrar el cubiculo ' + e.nombre + '?')) { //a diferencia de estudiantes nombre va con minuscula
                                            axios.put('http://localhost:3001/cubiculo/eliminar?id=' + e.id).then((response) => {
                                            try {
                                                if (response.status == 200) {
                                                    desactivarCubiculo(e.id);
                                                    generarPagina(pagina, porPagina, true, filtro);
                                                    alert('Cubiculo Eliminado exitosamente');
                                                } else {
                                                    alert('Ocurrió un ejecutar la operación');
                                                }
                                            } catch (error) {
                                                alert('Ocurrió un ejecutar la operación');
                                            }
                                        }).catch((error) => {
                                            alert('Ocurrió un ejecutar la operación');
                                        })
                                        }
                                    }} />
                                ) : (
                                    <FontAwesomeIcon className="iconoOpcion desactivado" icon={faTrashCan} title={reactivarCubiculo} />
                                )}
                            </div>
                        </div>))}
                </div>
            ) : (<p>Cargando...</p>)}
            {(totalElementos != null) ? (<p class="total"><b>Total de resultados:</b> {totalElementos}</p>) : (<p></p>)}
        </div>
    )
}