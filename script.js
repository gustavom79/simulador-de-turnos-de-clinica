document.addEventListener('DOMContentLoaded', function() {
    // Simulando una llamada API para obtener especialidades y médicos
    const especialidades = [
        { id: 1, nombre: 'Cardiología' },
        { id: 2, nombre: 'Dermatología' },
        { id: 3, nombre: 'Pediatría' }
    ];

    const medicos = {
        1: { nombres: ['Dr. Gómez', 'Dr. Martínez'], dias: ['Lunes', 'Miércoles', 'Viernes'] },
        2: { nombres: ['Dr. Pérez', 'Dr. López'], dias: ['Martes', 'Jueves'] },
        3: { nombres: ['Dr. Jiménez', 'Dra. Fernández'], dias: ['Lunes', 'Jueves'] }
    };

    const especialidadSelect = document.getElementById('especialidad');
    const medicoSelect = document.getElementById('medico');
    const diasAtencion = document.getElementById('diasAtencion');

    // Llenar especialidades
    especialidades.forEach(especialidad => {
        const option = document.createElement('option');
        option.value = especialidad.id;
        option.textContent = especialidad.nombre;
        especialidadSelect.appendChild(option);
    });

    // Llenar médicos según la especialidad seleccionada
    especialidadSelect.addEventListener('change', function() {
        const selectedEspecialidad = this.value;
        medicoSelect.innerHTML = '';

        if (medicos[selectedEspecialidad]) {
            medicos[selectedEspecialidad].nombres.forEach(medico => {
                const option = document.createElement('option');
                option.value = medico;
                option.textContent = medico;
                medicoSelect.appendChild(option);
            });
            diasAtencion.textContent = `Días de Atención: ${medicos[selectedEspecialidad].dias.join(', ')}`;
        } else {
            diasAtencion.textContent = 'Selecciona un médico para ver sus días de atención';
        }
    });

    let selectedDate = null;

    // Manejar el envío del formulario de turno
    document.getElementById('turnoForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const especialidad = especialidadSelect.value;
        const fechaInput = document.getElementById('fecha').value;
        if (!fechaInput) {
            alert("Por favor selecciona una fecha."); // Validación para asegurarse de que haya una fecha seleccionada
            return;
        }
        
        const fecha = new Date(fechaInput);
        const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' });

        // Verificar si la fecha seleccionada es un día de atención
        if (!medicos[especialidad].dias.includes(diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1))) {
            // Mostrar popup con fechas disponibles
            const availableDates = getNextAvailableDates(medicos[especialidad].dias);
            document.getElementById('availableDatesMessage').innerHTML = `
                El médico no atiende en la fecha seleccionada. Las próximas fechas disponibles son: <br>${availableDates.join('<br>')}
            `;
            document.getElementById('availableDatesPopup').style.display = 'flex';
            return; // No continuar con la confirmación del turno
        }

        // Si la fecha es válida, guardar la fecha seleccionada y mostrar el popup de confirmación
        selectedDate = fecha;
        mostrarPopupConfirmacion();
    });

    // Mostrar el popup de confirmación con la fecha seleccionada
    function mostrarPopupConfirmacion() {
        const nombre = document.getElementById('nombre').value;
        const dni = document.getElementById('dni').value;
        const especialidad = especialidadSelect.options[especialidadSelect.selectedIndex].text;
        const medico = medicoSelect.value;
        const cobertura = document.getElementById('cobertura').value === 'obra_social' ? 'Obra Social' : 'Particular';

        const turnoInfo = `
            Nombre: ${nombre}<br>
            DNI: ${dni}<br>
            Especialidad: ${especialidad}<br>
            Médico: ${medico}<br>
            Cobertura: ${cobertura}<br>
            Fecha: ${selectedDate.toLocaleDateString('es-ES')}
        `;

        document.getElementById('turnoInfo').innerHTML = turnoInfo;
        document.getElementById('confirmPopup').style.display = 'flex';
    }

    // Manejar la aceptación de las fechas disponibles
    document.getElementById('acceptAvailableDate').addEventListener('click', function() {
        document.getElementById('availableDatesPopup').style.display = 'none';

        // Permitir que el usuario seleccione una nueva fecha
        document.getElementById('fecha').focus(); // Enfocar el campo de fecha para que el usuario elija una nueva fecha
    });

    // Confirmar y cancelar turno
    document.getElementById('confirmButton').addEventListener('click', function() {
        document.getElementById('confirmPopup').style.display = 'none';
        document.getElementById('successPopup').style.display = 'flex';
    });

    document.getElementById('cancelButton').addEventListener('click', function() {
        document.getElementById('confirmPopup').style.display = 'none';
    });

    // Cerrar popup de éxito
    document.getElementById('closeSuccessPopup').addEventListener('click', function() {
        document.getElementById('successPopup').style.display = 'none';
        document.getElementById('turnoForm').reset();
        diasAtencion.textContent = 'Selecciona un médico para ver sus días de atención';
    });

    // Cerrar popup de fechas disponibles
    document.getElementById('closeAvailableDatesPopup').addEventListener('click', function() {
        document.getElementById('availableDatesPopup').style.display = 'none';
    });

    // Función para obtener las próximas fechas disponibles
    function getNextAvailableDates(dias) {
        const today = new Date();
        const availableDates = [];

        // Buscar las próximas 5 fechas disponibles
        while (availableDates.length < 5) {
            today.setDate(today.getDate() + 1);
            const dayName = today.toLocaleDateString('es-ES', { weekday: 'long' });
            if (dias.includes(dayName.charAt(0).toUpperCase() + dayName.slice(1))) {
                availableDates.push(today.toLocaleDateString('es-ES'));
            }
        }

        return availableDates;
    }
});




















