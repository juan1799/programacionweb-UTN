let students = [];
// let sortedList = [];
let arrayPaginacion = [];
let studentsLS = [];


studentsLS = JSON.parse(localStorage.getItem("students"));

const addPersona = (e) => {
    e.preventDefault();
    const nombre = document.getElementById('name').value.toUpperCase();
    const apellido = document.getElementById('lastName').value.toUpperCase();
    const DNI = document.getElementById('dni').value;
    
    if(!students.some((persona) => persona.DNI == DNI )){

        students.push({ nombre, apellido, DNI});
        students = orderByAlphabetical(students, person => person.apellido);
        totalPages = calculeTotalPages(students);
        modificarArreglo();
        
        localStorage.setItem("students", JSON.stringify(students));

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
    const list = students.filter((persona) => persona.DNI.toLocaleLowerCase().includes(document.getElementById('searchDNI').value.toLocaleLowerCase()) )

    document.getElementById('searchDNI').value = null;

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
                         <td><button onclick ="deleteStudent(${index})" class="btn__delete"><i class="bi bi-trash"></i></button>
                         </td>`;
        tbody.appendChild(row);
        
    })
    loadPaginationItem();
    
};

const loadPaginationItem = ( ) => {
    document.querySelector('#items').innerHTML = '';
    for(let i = 0; i< totalPages ; i++){
        const item = document.createElement('li');
        item.classList = `page-item`; 
        const link = `<button class="btn__pagination" onclick="pagination(${i})">${i + 1}</button>`;
        item.innerHTML = link; 
        document.querySelector('#items').append(item);
    }
}

const modificarArreglo = () => {
    arrayPaginacion = students.slice(from, rowLimit * activePage);
    renderTable(arrayPaginacion)
}

if(studentsLS) {
    students = studentsLS
    totalPages = calculeTotalPages(students);
    
    loadPaginationItem();
    modificarArreglo();

}


const pagination = (page) => {  
     activePage = page + 1;
     from = rowLimit * page;
     if(from <= students.length){
        modificarArreglo();
     }
}

const nextPage = () => {
    if(activePage<totalPages){
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
    students = students.filter((student) => student.DNI != students[calculeIndex(index)].DNI);
    localStorage.setItem('students', JSON.stringify(students));
    totalPages = calculeTotalPages(students);
    loadPaginationItem();
    modificarArreglo();
}

// const modifyStudent = (e, index) => {
//     e.preventDefault();

//     sortedList[calculeIndex(index)].nombre = document.getElementById('nameModify').value.toUpperCase();
//     sortedList[calculeIndex(index)].apellido = document.getElementById('lastNameModify').value.toUpperCase();
//     sortedList[calculeIndex(index)].DNI = document.getElementById('dniModify').value;
    
//     modificarArreglo();
// }