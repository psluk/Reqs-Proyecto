--------------------------------------------------------------------------
-- Autor:       [nombre]
-- Fecha:       [año]-[mes]-[día]
-- Descripción: [descripción]
-- Códigos de error:
--  - [ninguno]
--------------------------------------------------------------------------

CREATE PROCEDURE [dbo].[BiblioTEC_SP_Nombre]
    -- Parámetros
AS
BEGIN
    SET NOCOUNT ON;         -- No retorna metadatos

    -- CONTROL DE ERRORES
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transaccion_iniciada BIT = 0;

    BEGIN TRY

        -- DECLARACIÓN DE VARIABLES
        -- 

        -- VALIDACIONES
        --

        -- INICIO DE LA TRANSACCIÓN
        IF @@TRANCOUNT = 0
        BEGIN
            SET @transaccion_iniciada = 1;
            BEGIN TRANSACTION;
        END;

        --

        -- COMMIT DE LA TRANSACCIÓN
        IF @transaccion_iniciada = 1
        BEGIN
            COMMIT TRANSACTION;
        END;

    END TRY
    BEGIN CATCH

        SET @ErrorNumber = ERROR_NUMBER();
        SET @ErrorSeverity = ERROR_SEVERITY();
        SET @ErrorState = ERROR_STATE();
        SET @Message = ERROR_MESSAGE();

        IF @transaccion_iniciada = 1
        BEGIN
            ROLLBACK;
        END;

        RAISERROR('%s - Error Number: %i', 
            @ErrorSeverity, @ErrorState, @Message, @ErrorNumber);

    END CATCH;
END;