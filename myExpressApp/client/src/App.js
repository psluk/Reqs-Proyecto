import React, { useEffect, useState, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import './App.css'
import Login from './Login'
import EstudianteMenu from './EstudianteMenu'
import Registro from './Registro'
import Header from './Header'
import ListaEstudiantes from "./MenuAdministrador/ListaEstudiantes";

export const LoginContext = createContext();
export const IdEstContext = createContext();

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [IdEstudiante, setIdEstudiante] = useState('')

  return (
      <>
      <Header />
      <div className="app">
          <Routes>
            <Route path="/" element={
              <IdEstContext.Provider value={[IdEstudiante,setIdEstudiante]}>
                <LoginContext.Provider value={[loggedIn,setLoggedIn]}>
                  <Login />
                </LoginContext.Provider>
              </IdEstContext.Provider>
            } />
            <Route path="/Menu" element={
              <IdEstContext.Provider value={[IdEstudiante,setIdEstudiante]}>
                <LoginContext.Provider value={[loggedIn,setLoggedIn]}>
                  <EstudianteMenu />
                </LoginContext.Provider>
              </IdEstContext.Provider>
              }/>
            <Route path="/Registro" element={<Registro />} />
            <Route path="/Estudiantes" element={<ListaEstudiantes />} />
        </Routes>
      </div>
      </>
  )
}