import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './ListaCubiculo.css';
import '../Tarjeta.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'

let listaCompleta = [];
const reactivarCubiculo = 'Puede volver a activar el cubículo desde el menú de edición';

export default () => {
    const navigate = useNavigate();
    useEffect(() => {
        axios.get("/api/login").then((response) => {
            if(!(response.data.loggedIn && response.data.tipoUsuario == 'Administrador')){
                navigate('/')
            }
        })
        
        axios.get('/api/cubiculo/cubiculos').then((response) => {
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
            let nuevoNumeroPaginas = (Math.ceil(listaFiltrada.length / tamano) < 1) ? 1 : Math.ceil(listaFiltrada.length / tamano);
            setPaginas(nuevoNumeroPaginas);

            if (nuevaPagina < 1) {
                nuevaPagina = 1;
            } else if (nuevaPagina > nuevoNumeroPaginas) {
                nuevaPagina = nuevoNumeroPaginas;
            }
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
            <h1>Gestión de cubículos</h1>
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
                                    <p>
                                        <b>ID:</b> {e.id}
                                        <b> · Estado:</b> {e.estado}
                                        <b> · Capacidad:</b> {e.capacidad}
                                        <b> · Servicios especiales:</b> {((e.servicios && e.servicios.join('') != '') ? (<span class="hoverInfo" title={e.servicios.join('\n')}>Ver lista</span>) : <>Ninguno</>)}
                                        <b> · Tiempo máximo:</b> {(e.minutosMaximo >= 60 ? (Math.floor(e.minutosMaximo/60) + " h") : <></>)} {(e.minutosMaximo % 60 ? (e.minutosMaximo % 60 + " min") : <></>)} 
                                    </p>
                                </div>
                            </div>
                            <div className="opciones">
                                <FontAwesomeIcon className="iconoOpcion" icon={faCalendarDays} title="Ver historial" onClick={() => {navigate('/AdminReservas?idCubiculo=' + e.id)}} />
                                <FontAwesomeIcon className="iconoOpcion" icon={faPenToSquare} onClick={() => {navigate('/EditarCubiculo?id=' + e.id)}} title="Modificar cubículo" />
                                {(e.estado != 'Eliminado') ? (
                                    <FontAwesomeIcon className="iconoOpcion" icon={faTrashCan} title="Borrar cubículo" onClick={() => {
                                        if (window.confirm('¿Desea borrar el cubículo ' + e.nombre + '?\n\nEn caso de haber reservas activas, serán canceladas y se notificará a los respectivos usuarios.')) { //a diferencia de estudiantes nombre va con minuscula
                                            axios.put('/api/cubiculo/eliminar?id=' + e.id).then((response) => {
                                            try {
                                                if (response.status == 200) {
                                                    desactivarCubiculo(e.id);
                                                    generarPagina(pagina, porPagina, true, filtro);
                                                    alert('Cubículo eliminado exitosamente');
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