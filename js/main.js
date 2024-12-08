// mini api for working with dom and localStorage
const dom ={
    create: (tagName) =>  document.createElement(tagName),
    getById: (idElement) => document.getElementById(idElement),
    setInStorage: (key, item) => localStorage.setItem(key, JSON.stringify(item)),
    getFromStorage: (key) => JSON.parse(localStorage.getItem(key)),
    newId: () => {
        let id = localStorage.getItem('id') || 0;
        id++
        localStorage.setItem('id', id)
        return id
    }
}

// constants & variables ----------------------------------------

// regular expression for validate entered data
const regex = /^[\s\wа-яА-ЯёЁїЇєЄіІ]+=[\s\wа-яА-ЯёЁїЇєЄіІ]+$/;

// here we get form from dom structure in our page
const form = document.forms['form-pair'];


//get input field from form and edit pattern for check enter data
const input_pair = dom.getById('input');
input_pair.attributes.pattern.value = regex.source;

// ul block with pairs 
const list_of_pairs_dom = dom.getById('list-of-pairs');

// get list of pairs from storage and add in dom 
let list_of_pairs = dom.getFromStorage('list_of_pairs') || [];
render(list_of_pairs)

// get delete button from dom
const btn_delete_pairs = dom.getById('btn-delete-pairs');

// filter buttons
const btn_sort_by_name = dom.getById('btn-sort-by-name');
const btn_sort_by_value = dom.getById('btn-sort-by-value');

// functions & constructor----------------------------------------------
class Pair {
    constructor(name, value, id) {
        this.name = name,
        this.value = value, 
        this.id = id,
        this.status= true,
        this.element= dom.create('li')
    }
}


// LI PAIR make list element clone pair in dom
function init_dom_pair(pair) {
    const li_element = dom.create('li')
    li_element.innerText = `${pair.name}=${pair.value}`;
    li_element.id = pair.id;

    // listen select or unselect pair (status change for delete)
    li_element.addEventListener('click',()=>{
        if (pair.status) {
            li_element.style.background = 'lightblue';
            pair.status = false;
        }
        else{
            li_element.style.background = '';
            pair.status = true;
        }
    })
    return li_element;
}


//check data valid
function validator(data) {
    if (regex.test(data)) return data;
    else throw new Error("invalid data");
}
// clean all spaces
function cleaner(data) {
    return data.replaceAll(' ', '');
}


//add scroll in pair list when pairs count 15
function check_count_pair() {
    if (list_of_pairs_dom.children.length > 14) {
        list_of_pairs_dom.style.overflow = 'scroll';   
    }
    else list_of_pairs_dom.style.overflow = '';
}


// get array with pairs and display in ul list in dom
function render(data) {
    list_of_pairs_dom.innerText = ''
    data.forEach(item => {
        list_of_pairs_dom.append(init_dom_pair(item))
    });
}

// create array without pairs which has status false
function filter_deleted(params) {
    const remained = [];
    params.filter(pair => {
            if(pair.status === true ) {
                remained.push(pair)
            }
        })
    return remained
}

// call function with args (array_of_pairs, sort_choose) and return sorted array with pairs
function sortBy(data,critery) {
    if (critery === 'name') 
        return data.sort((a,b) => {
        if (a.name > b.name) return 1 
        if (a.name < b.name) return -1
        if (a.name === b.name) return 0
    })
    if (critery === 'value')
        return data.sort((a,b) => {
            if (a.value > b.value) return 1 
            if (a.value < b.value) return -1
            if (a.value === b.value) return 0
        }) 
}


// listeners --------------------------------------------

// listen form on submit validate data, cleaning data, create pair and save in array and storage 
form.addEventListener('submit', (e)=>{
    e.preventDefault()
    const value = form.input.value;
    
    const validValue = validator(value);
    const clearValue = cleaner(validValue).split('=');

    list_of_pairs.push(new Pair(clearValue[0],clearValue[1],dom.newId()));

    dom.setInStorage('list_of_pairs',list_of_pairs);

    render(list_of_pairs);
    
    check_count_pair();
    form.input.value ='';
})

// delete all selected pairs
btn_delete_pairs.addEventListener('click', ()=>{
    list_of_pairs = filter_deleted(list_of_pairs);
    dom.setInStorage('list_of_pairs',list_of_pairs);
    render(list_of_pairs);
    check_count_pair();
})

// sort by name a-z
btn_sort_by_name.addEventListener('click', ()=>{
    render(sortBy(list_of_pairs,'name'))
})

// sort by value a-z
btn_sort_by_value.addEventListener('click', ()=>{
    render(sortBy(list_of_pairs,'value'))
})


// sizing on focus input
input.addEventListener('focus', ()=>{
    dom.getById('control-btns')
    .style.height = '0vh'
    dom.getById('list-of-pairs')
    .style.height = '30vh'
    dom.getById('main').style.justifyContent = 'flex-start'
})
input.addEventListener('blur', ()=>{
    dom.getById('list-of-pairs')
    .style.height = ''
    dom.getById('control-btns')
    .style.height = ''
})

// END the main task-----------------------------------------



// ADDITION's -----------------------------------------------


