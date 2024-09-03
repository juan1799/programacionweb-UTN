const students = [];
let sortedList = [];
let arrayPaginacion = [];

const addPersona = (e) => {
    e.preventDefault();
    const nombre = document.getElementById('name').value.toUpperCase();
    const apellido = document.getElementById('lastName').value.toUpperCase();
    const DNI = document.getElementById('dni').value;
    
    if(!students.some((persona) => persona.DNI == DNI )){

        students.push({ nombre, apellido, DNI});
        sortedList = orderByAlphabetical(students, person => person.apellido);
        totalPages = calculeTotalPages(sortedList);
        modificarArreglo();

        document.getElementById('name').value = null;
        document.getElementById('lastName').value = null;
        document.getElementById('dni').value = null;
    }
    else{
        console.log('Esa persona ya está cargada en la tabla'); 
    }
};

const search = (e) => {
    e.preventDefault();
    const list = students.filter((persona) => persona.nombre.toLocaleLowerCase().includes(document.getElementById('searchName').value.toLowerCase()) )

    document.getElementById('searchName').value = null;

    renderTable(list);
}
const orderByAlphabetical = (list, getter, order = 'asc')  => {
    list.sort((a,b) => {
        const first = getter(a);
        const second = getter(b);

        const compare = first.localeCompare(second);
        return order === 'asc' ? compare : -compare;
    });
    return list;
}

let from = 0;
let activePage = 1;
const rowLimit = 5; 
let totalPages;


const calculeTotalPages = (list) =>  Math.ceil(list.length/rowLimit);

const renderTable = (list) => {

    const tbody = document.getElementById('table');

    tbody.innerHTML = '';

    list.map((student, index)=>{
        const row = document.createElement('tr');
        row.setAttribute('key',student.DNI);
        row.innerHTML = `<td>${student.apellido}</td>
                         <td>${student.nombre}</td>
                         <td>${student.DNI}</td>
                         <td><button onclick ="deleteStudent(${index})"><i class="bi bi-trash"></i></button>
                         <button onclick ="modifyStudent(${index})"><i class="bi bi-pencil"></i></button></td>`;
        tbody.appendChild(row);
        
    })
    loadPaginationItem();
    
};

const loadPaginationItem = ( ) => {
    document.querySelector('#items').innerHTML = '';
    for(let i = 0; i< totalPages ; i++){
        const item = document.createElement('li');
        item.classList = `page-item`; 
        const link = `<button class="page-link" onclick="pagination(${i})">${i + 1}</button>`;
        item.innerHTML = link; 
        document.querySelector('#items').append(item);
    }
}

const modificarArreglo = () => {
    arrayPaginacion = sortedList.slice(from, rowLimit * activePage);
    renderTable(arrayPaginacion)
}

const pagination = (page) => {  
     activePage = page + 1;
     from = rowLimit * page;
     if(from <= students.length){
        modificarArreglo();
     }
}

const nextPage = () => {
    if(activePage<rowLimit && totalPages != 1){
        from += rowLimit;
        activePage ++;
        modificarArreglo();
    }
}

const previousPage = () => {
    if(from > 0){
        from -= rowLimit;
        activePage --;
        modificarArreglo();
    }
}

const calculeIndex =(index) => {
    let element;
    activePage == 1 ? element = index : element = index + (activePage*rowLimit - 5);
    return element;
}

const deleteStudent = (index) =>{
    sortedList = sortedList.filter((student) => student.DNI != sortedList[calculeIndex(index)].DNI);
    
    totalPages = calculeTotalPages(sortedList);
    loadPaginationItem();
    modificarArreglo();
}

const modifyStudent = (index) => {
    sortedList[calculeIndex(index)].nombre = prompt('Ingrese el nombre: ');
    sortedList[calculeIndex(index)].apellido = prompt('Ingrese apellido: ');
    sortedList[calculeIndex(index)].DNI = prompt('ingrese DNI: ');
    
    modificarArreglo();
}