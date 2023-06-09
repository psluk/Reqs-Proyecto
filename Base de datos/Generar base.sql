/****** Object:  Database [appbibliotec-database]    Script Date: 20 may. 2023 9:05:30 a. m. ******/
CREATE DATABASE [appbibliotec-database]  (EDITION = 'GeneralPurpose', SERVICE_OBJECTIVE = 'GP_S_Gen5_2', MAXSIZE = 32 GB) WITH CATALOG_COLLATION = SQL_Latin1_General_CP1_CI_AS, LEDGER = OFF;
GO
ALTER DATABASE [appbibliotec-database] SET COMPATIBILITY_LEVEL = 150
GO
ALTER DATABASE [appbibliotec-database] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [appbibliotec-database] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [appbibliotec-database] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [appbibliotec-database] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [appbibliotec-database] SET ARITHABORT OFF 
GO
ALTER DATABASE [appbibliotec-database] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [appbibliotec-database] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [appbibliotec-database] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [appbibliotec-database] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [appbibliotec-database] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [appbibliotec-database] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [appbibliotec-database] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [appbibliotec-database] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [appbibliotec-database] SET ALLOW_SNAPSHOT_ISOLATION ON 
GO
ALTER DATABASE [appbibliotec-database] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [appbibliotec-database] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [appbibliotec-database] SET  MULTI_USER 
GO
ALTER DATABASE [appbibliotec-database] SET ENCRYPTION ON
GO
ALTER DATABASE [appbibliotec-database] SET QUERY_STORE = ON
GO
ALTER DATABASE [appbibliotec-database] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 100, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
/*** The scripts of database scoped configurations in Azure should be executed inside the target database connection. ***/
GO
-- ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 8;
GO
/****** Object:  User [BiblioAPI]    Script Date: 20 may. 2023 9:05:30 a. m. ******/
CREATE USER [BiblioAPI] FOR LOGIN [BiblioAPI] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Table [dbo].[Cubiculos]    Script Date: 20 may. 2023 9:05:30 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Cubiculos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idEstado] [int] NOT NULL,
	[nombre] [varchar](16) NOT NULL,
	[capacidad] [int] NOT NULL,
	[minutosMax] [int] NOT NULL,
 CONSTRAINT [PK_Cubiculos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Errors]    Script Date: 20 may. 2023 9:05:30 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Errors](
	[ErrorID] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [varchar](100) NULL,
	[ErrorNumber] [int] NULL,
	[ErrorState] [int] NULL,
	[ErrorSeverity] [int] NULL,
	[ErrorLine] [int] NULL,
	[ErrorProcedure] [varchar](max) NULL,
	[ErrorMessage] [varchar](max) NULL,
	[ErrorDateTime] [datetime] NULL,
 CONSTRAINT [PK_DBErrors] PRIMARY KEY CLUSTERED 
(
	[ErrorID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EstadosCubiculo]    Script Date: 20 may. 2023 9:05:30 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EstadosCubiculo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](32) NOT NULL,
 CONSTRAINT [PK_EstadosCubiculo] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Estudiantes]    Script Date: 20 may. 2023 9:05:30 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Estudiantes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idUsuario] [int] NOT NULL,
	[cedula] [int] NOT NULL,
	[carnet] [int] NOT NULL,
	[nombre] [varchar](32) NOT NULL,
	[apellido1] [varchar](16) NOT NULL,
	[apellido2] [varchar](16) NOT NULL,
	[fechaDeNacimiento] [date] NOT NULL,
	[activo] [bit] NOT NULL,
	[eliminado] [bit] NOT NULL,
 CONSTRAINT [PK_Estudiantes] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Reservas]    Script Date: 20 may. 2023 9:05:30 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Reservas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idCubiculo] [int] NOT NULL,
	[idEstudiante] [int] NOT NULL,
	[fecha] [datetime] NOT NULL,
	[horaInicio] [datetime] NOT NULL,
	[horaFin] [datetime] NOT NULL,
	[activo] [bit] NOT NULL,
	[confirmado] [bit] NOT NULL,
	[eliminada] [bit] NOT NULL,
 CONSTRAINT [PK_Reservas] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ServiciosDeCubiculo]    Script Date: 20 may. 2023 9:05:30 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ServiciosDeCubiculo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idCubiculo] [int] NOT NULL,
	[idServiciosEspeciales] [int] NOT NULL,
	[activo] [bit] NOT NULL,
 CONSTRAINT [PK_ServiciosDeCubiculo] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ServiciosEspeciales]    Script Date: 20 may. 2023 9:05:30 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ServiciosEspeciales](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](64) NOT NULL,
 CONSTRAINT [PK_ServiciosEspeciales] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TiposUsuario]    Script Date: 20 may. 2023 9:05:30 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TiposUsuario](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](16) NOT NULL,
 CONSTRAINT [PK_TiposUsuario] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuarios]    Script Date: 20 may. 2023 9:05:30 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuarios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idTipoUsuario] [int] NOT NULL,
	[correo] [varchar](128) NOT NULL,
	[clave] [varchar](64) NOT NULL,
 CONSTRAINT [PK_Usuarios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Cubiculos]  WITH CHECK ADD  CONSTRAINT [FK_Cubiculos_EstadosCubiculo] FOREIGN KEY([idEstado])
REFERENCES [dbo].[EstadosCubiculo] ([id])
GO
ALTER TABLE [dbo].[Cubiculos] CHECK CONSTRAINT [FK_Cubiculos_EstadosCubiculo]
GO
ALTER TABLE [dbo].[Estudiantes]  WITH CHECK ADD  CONSTRAINT [FK_Estudiantes_Usuarios] FOREIGN KEY([idUsuario])
REFERENCES [dbo].[Usuarios] ([id])
GO
ALTER TABLE [dbo].[Estudiantes] CHECK CONSTRAINT [FK_Estudiantes_Usuarios]
GO
ALTER TABLE [dbo].[Reservas]  WITH CHECK ADD  CONSTRAINT [FK_Reservas_Cubiculos] FOREIGN KEY([idCubiculo])
REFERENCES [dbo].[Cubiculos] ([id])
GO
ALTER TABLE [dbo].[Reservas] CHECK CONSTRAINT [FK_Reservas_Cubiculos]
GO
ALTER TABLE [dbo].[Reservas]  WITH CHECK ADD  CONSTRAINT [FK_Reservas_Estudiantes] FOREIGN KEY([idEstudiante])
REFERENCES [dbo].[Estudiantes] ([id])
GO
ALTER TABLE [dbo].[Reservas] CHECK CONSTRAINT [FK_Reservas_Estudiantes]
GO
ALTER TABLE [dbo].[ServiciosDeCubiculo]  WITH CHECK ADD  CONSTRAINT [FK_ServiciosDeCubiculo_Cubiculos] FOREIGN KEY([idCubiculo])
REFERENCES [dbo].[Cubiculos] ([id])
GO
ALTER TABLE [dbo].[ServiciosDeCubiculo] CHECK CONSTRAINT [FK_ServiciosDeCubiculo_Cubiculos]
GO
ALTER TABLE [dbo].[ServiciosDeCubiculo]  WITH CHECK ADD  CONSTRAINT [FK_ServiciosDeCubiculo_ServiciosEspeciales] FOREIGN KEY([idServiciosEspeciales])
REFERENCES [dbo].[ServiciosEspeciales] ([id])
GO
ALTER TABLE [dbo].[ServiciosDeCubiculo] CHECK CONSTRAINT [FK_ServiciosDeCubiculo_ServiciosEspeciales]
GO
ALTER TABLE [dbo].[Usuarios]  WITH CHECK ADD  CONSTRAINT [FK_Usuarios_TiposUsuario] FOREIGN KEY([idTipoUsuario])
REFERENCES [dbo].[TiposUsuario] ([id])
GO
ALTER TABLE [dbo].[Usuarios] CHECK CONSTRAINT [FK_Usuarios_TiposUsuario]
GO
ALTER DATABASE [appbibliotec-database] SET  READ_WRITE 
GO
