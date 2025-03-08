// --------------------------------------------------------------
// При загрузке страницы
PAGE_DATA = [] // = Массив для отправки на сервер при сохранении
SITE_ID = 0
INNER_PAGE = ''
MAX_BLOCK_INDEX = 0

const parser = new DOMParser()

// Структура PAGE_DATA лога
// [
//     {
//         'site_name':'name',
//         'block_id': 0,
//         'content': {
//              'type': 'add',
//              'what': ``
//          }
//     }
// ]


// ПРИ ИЗМЕНЕИЕ БЛОКОВ ЗАНОСИТЬ ЭТИ ИЗМЕНЕНИЯ В PAGE_DATA

// ----- Получение id сайта из БД sites
function get_site_id_fromDB(){
    data = {
        name: localStorage.getItem('site_name'),
        username: localStorage.getItem('name'),
        password: localStorage.getItem('password')
    }
    return fetch('http://127.0.0.1:8000/api/get_site_id_fromDB', {
        method: 'POST', 
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
}
window.addEventListener('load', () => {
    get_site_id_fromDB()
        .then((data) => {
            return data.json()})
        .then((data) => {
            SITE_ID = data.id
            // ДОбавление сущ блоков в PAGE_DATA
            BLOCK_COUNTER = 0
            for (let i = 0; i < data.page.length; i++) {
                PAGE_DATA.push({
                    'block_id': BLOCK_COUNTER,
                    'content': {
                        'type': 'add',
                        'what': data.page[i]
                    }
                })
                BLOCK_COUNTER += 1
            }

            sectionForBlocks = document.querySelector('.edit_wrapper')
            // Вставка загруженных блоков с сервера
            for (let i = 0; i < PAGE_DATA.length; i++) {

                html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')
                console.log(html_block)
                html_block.setAttribute('id', PAGE_DATA[i].block_id)
                sectionForBlocks.append(html_block)
            }
            MAX_BLOCK_INDEX = PAGE_DATA.length
            vizSetBlockBTN()

            console.log(PAGE_DATA, data)
            
        })
})


// ----- Функции открытия-закрытия попапов / скрытие / показ
function show(el, stat = 0){
    if (!stat){
        el.classList.remove('not_visible')
        el.classList.add('visible')
    } if (stat == 1){
        el.classList.remove('left')
        el.classList.add('right')
    }
}
function hide(el, stat = 0){
    if (!stat){
        el.classList.remove('visible')
        el.classList.add('not_visible')
    } if (stat == 1){
        el.classList.remove('right')
        el.classList.add('left')
    }
}
function openPopUp(popup){
    popup.classList.remove('disactive')
    popup.classList.add('active')
}
function closePopUp(popup){
    popup.classList.remove('active')
    popup.classList.add('disactive')
}

// ----- Назад
btnBack = document.querySelector('.header_buttons__button_back')
isSavePopUp = document.querySelector('.pop_up_save')
btnBack.addEventListener('click', () => {
    openPopUp(isSavePopUp)
})
// ----- Настройка
btnSetSite = document.querySelector('.header_buttons__button_set')
btnSetSite.addEventListener('click', () => {
    openPopUp(isSavePopUp)
})
// ----- Закрыть
btnClosePopUp = document.querySelector('.save_window_cross')
btnClosePopUp.addEventListener('click', () => {
    closePopUp(isSavePopUp)
})

// ------------------------
// ---- Всплытие кнопок при наведении на блок -----
editButtons = document.querySelector('.edit_set_btns')
addNewBlockBtn = document.querySelector('.edit_main_addbtn')



REDACTED_BLOCK_INDEX = 0
function vizSetBlockBTN(){
    mainBlocks = document.querySelectorAll('.block_to_edit')
    for (let i = 0; i < mainBlocks.length; i++) {
        mainBlocks[i].addEventListener('click', () => {

            // Добавлять значение BLOCK_COUNTER

            show(editButtons)
            REDACTED_BLOCK_INDEX = i
            
            mainBlocks[i].style.border = '5px solid rgb(8, 153, 8)';
            for (let j = 0; j < mainBlocks.length; j++) {
                if(j==i){continue}
                else{
                    mainBlocks[j].style.border = '1px solid #000';
                }               
            }
        } )
    }
}



// ----------------------------------
// Функционал кнопок каждого отдельного длока
crossBTN_block = document.querySelector('.edit_set_btns_right_cross')
crossBTN_block.addEventListener('click', () => {

    id_to_del = mainBlocks[REDACTED_BLOCK_INDEX].id
    new_PAGE_DATA = []
    for (let i = 0; i < PAGE_DATA.length; i++) {
        if (PAGE_DATA[i].block_id != id_to_del){
            new_PAGE_DATA.push(PAGE_DATA[i])
        }
    }
    PAGE_DATA = new_PAGE_DATA


    mainBlocks[REDACTED_BLOCK_INDEX].remove()
    vizSetBlockBTN()
    if (mainBlocks.length == 0){
        hide(editButtons)
    }
})
moveDownBTN_block = document.querySelector('.edit_set_btns_right_arrow_down')
moveDownBTN_block.addEventListener('click', () => {
    rplsed = sectionForBlocks.replaceChild(mainBlocks[REDACTED_BLOCK_INDEX], mainBlocks[REDACTED_BLOCK_INDEX + 1])
    id_to_up = rplsed.id
    id_to_down = mainBlocks[REDACTED_BLOCK_INDEX].id


    new_PAGE_DATA = []
    for (let i = 0; i < mainBlocks.length; i++) {
        if (mainBlocks[i].id != id_to_down && mainBlocks[i].id != id_to_up){
            new_PAGE_DATA.push(PAGE_DATA[i])
        }
        if(mainBlocks[i].id == id_to_down){
            new_PAGE_DATA.push(PAGE_DATA[i + 1])
            new_PAGE_DATA.push(PAGE_DATA[i])
        }
    }
    PAGE_DATA = new_PAGE_DATA

    sectionForBlocks.insertBefore(rplsed, mainBlocks[REDACTED_BLOCK_INDEX])
    REDACTED_BLOCK_INDEX += 1
    vizSetBlockBTN()
})
moveUpBTN_block = document.querySelector('.edit_set_btns_right_arrow_up')
moveUpBTN_block.addEventListener('click', () => {
    rplsed = sectionForBlocks.replaceChild(mainBlocks[REDACTED_BLOCK_INDEX], mainBlocks[REDACTED_BLOCK_INDEX - 1])
    id_to_down = rplsed.id
    id_to_up = mainBlocks[REDACTED_BLOCK_INDEX].id


    new_PAGE_DATA = []
    for (let i = 0; i < mainBlocks.length; i++) {
        if (mainBlocks[i].id != id_to_up && mainBlocks[i].id != id_to_down){
            new_PAGE_DATA.push(PAGE_DATA[i])
        }
        if(mainBlocks[i].id == id_to_down){
            new_PAGE_DATA.push(PAGE_DATA[i + 1])
            new_PAGE_DATA.push(PAGE_DATA[i])
        }
    }
    PAGE_DATA = new_PAGE_DATA

    mainBlocks[REDACTED_BLOCK_INDEX].after(rplsed)
    REDACTED_BLOCK_INDEX -= 1
    vizSetBlockBTN()
})

// ----------------------------------
// НАСТРОЙКА КОНТЕНТА И БЛОКА
setContent = document.querySelector('.set_content')
setContentCross = document.querySelector('.set_content_img_cross')
setContentBtn = document.querySelector('.edit_set_btns_left_content')
setContentBtn.addEventListener('click', () => {
    show(setContent, 1)
    inject_block_content()
})
setContentCross.addEventListener('click', () => {
    hide(setContent, 1)
    scTitle.value = ''
    scSubtitle.value = ''
    scColor.value = '#000'
    scText.value = ''
})
scTitle = document.querySelector('.set_content_inps_h_inp')
scSubtitle = document.querySelector('.set_content_inps_w_inp')
scColor = document.querySelector('.set_content_inps_color_bg_inp')
scText = document.querySelector('.set_content_inps_text_inp')
function inject_block_content(){
    try{
        scTitle.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').innerHTML
        scSubtitle.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h2').innerHTML
        scColor.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h2').style.color
    }catch{}
    try{
        scText.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').innerHTML
        scColor.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.color
    }catch{}
}
scSaveBTN = document.querySelector('.set_content_save')
scSaveBTN.addEventListener('click', () => {
    try{
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').innerHTML = scTitle.value
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h2').innerHTML = scSubtitle.value
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.color = scColor.value
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h2').style.color = scColor.value
/// ----- СОХРАНЕНИЕ ИЗМЕНЕНИЙ В PAGE_DATA
        for (let i = 0; i < PAGE_DATA.length; i++) {
            if(PAGE_DATA[i].block_id == mainBlocks[REDACTED_BLOCK_INDEX].id){

                html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')
                // -------------- CAHNGE html_block ---------------------
                html_block.querySelector('h1').innerHTML = scTitle.value
                html_block.querySelector('h2').innerHTML = scSubtitle.value
                html_block.querySelector('h1').style.color = scColor.value
                html_block.querySelector('h2').style.color = scColor.value

                to_what = `${html_block.outerHTML}\n`
                PAGE_DATA[i].content.what = to_what
/// -------------------------------
            }
        }

    }catch{}
    try{
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').innerHTML = scText.value
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.color = scColor.value
/// ----- СОХРАНЕНИЕ ИЗМЕНЕНИЙ В PAGE_DATA
        for (let i = 0; i < PAGE_DATA.length; i++) {
            if(PAGE_DATA[i].block_id == mainBlocks[REDACTED_BLOCK_INDEX].id){
                
                html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')
                // -------------- CAHNGE html_block ---------------------
                html_block.querySelector('p').innerHTML = scText.value
                html_block.querySelector('p').style.color = scColor.value

                to_what = `${html_block.outerHTML}\n`
                PAGE_DATA[i].content.what = to_what

            }
        }
/// ------------------------------
    }catch{}

    hide(setContent, 1)
    scTitle.value = ''
    scSubtitle.value = ''
    scColor.value = '#000'
    scText.value = ''
})


// ----- Блок насройки блока
btnSetBlock = document.querySelector('.edit_set_btns_left_block')
setBlock = document.querySelector('.set_block')
setBlockCross = document.querySelector('.set_block_img_cross')
btnSetBlock.addEventListener('click', () => {
    show(setBlock, 1)
    inject_block_block()
})
setBlockCross.addEventListener('click', () => {
    hide(setBlock, 1)
})
sbHeight = document.querySelector('.set_block_inps_h_inp')
sbWidth = document.querySelector('.set_block_inps_w_inp')
sbLocation = document.querySelector('.set_block_inps_pos_select')
sbPaddings = document.querySelector('.set_block_inps_m_inp')
function inject_block_block(){
    try{
        sbHeight.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.height
        sbWidth.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.width
        sbLocation.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.textAlign
        sbPaddings.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.padding
    }catch{}
    try{
        sbHeight.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.height
        sbWidth.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.width
        sbLocation.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.textAlign
        sbPaddings.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.padding
    }catch{}
}
sbSave = document.querySelector('.set_block_save')
sbSave.addEventListener('click', () => {
    try{
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.height = sbHeight.value
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.width = sbWidth.value 
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.textAlign = sbLocation.value
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.padding = sbPaddings.value
        mainBlocks[REDACTED_BLOCK_INDEX].style.alignItems = sbLocation.value

        // ----- СОХРАНЕНИЕ ИЗМЕНЕНИЙ В PAGE_DATA
        for (let i = 0; i < PAGE_DATA.length; i++) {
            if(PAGE_DATA[i].block_id == mainBlocks[REDACTED_BLOCK_INDEX].id){
                
                html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')
                // -------------- CAHNGE html_block ---------------------
                html_block.querySelector('p').style.height = sbHeight.value
                html_block.querySelector('p').style.width = sbWidth.value 
                html_block.querySelector('p').style.textAlign = sbLocation.value
                html_block.querySelector('p').style.padding = sbPaddings.value
                html_block.style.alignItems = sbLocation.value

                to_what = `${html_block.outerHTML}\n`
                PAGE_DATA[i].content.what = to_what

            }
        }
        // -------------------------------------

    }catch{
        mainBlocks[REDACTED_BLOCK_INDEX].style.height = sbHeight.value
        mainBlocks[REDACTED_BLOCK_INDEX].style.width = sbWidth.value
        mainBlocks[REDACTED_BLOCK_INDEX].style.textAlign = sbLocation.value
        mainBlocks[REDACTED_BLOCK_INDEX].style.textAlign = sbLocation.value
        mainBlocks[REDACTED_BLOCK_INDEX].style.padding = sbPaddings.value

        // ----- СОХРАНЕНИЕ ИЗМЕНЕНИЙ В PAGE_DATA
        for (let i = 0; i < PAGE_DATA.length; i++) {
            if(PAGE_DATA[i].block_id == mainBlocks[REDACTED_BLOCK_INDEX].id){
                
                html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')
                // -------------- CAHNGE html_block ---------------------
                html_block.style.height = sbHeight.value
                html_block.style.width = sbWidth.value
                html_block.style.textAlign = sbLocation.value
                html_block.style.textAlign = sbLocation.value
                html_block.style.padding = sbPaddings.value

                to_what = `${html_block.outerHTML}\n`
                PAGE_DATA[i].content.what = to_what

            }
        }
        // -------------------------------------

    }
    hide(setBlock, 1)
    sbHeight.value = ''
    sbWidth.value = ''
    sbLocation.value = ''
    sbPaddings.value = ''
})

// ------- Добавление нового блока --------------
closeBtnAdd = document.querySelector('.add_content_cross')
popupAddBlock = document.querySelector('.add_content')
closeBtnAdd.addEventListener('click', () => {
    closePopUp(popupAddBlock)
})
addNewBlockBtn.addEventListener('click', () => {
    openPopUp(popupAddBlock)
})

// MAIN FUNCTION
// Добавление собственно блока на страницу из списка добавления блоков
blocks = {
    'title_b': document.querySelector('#title_b'),
    'text_b': document.querySelector('#text_b'),
    'columns_b': document.querySelector('#columns_b')
}
BLOCK_COUNTER = 0
ks = Object.keys(blocks)
for (let i = 0; i < ks.length; i++) {
    blocks[ks[i]].addEventListener('click', () => {
        closePopUp(popupAddBlock)
        MAX_BLOCK_INDEX += 1
        visualizateBlock(ks[i])
        document.querySelector('#_').id = MAX_BLOCK_INDEX
        vizSetBlockBTN()
        
        PAGE_DATA.push({
            'block_id': BLOCK_COUNTER,
            'content': {
                'type': 'add',
                'what': TEMPLATE_BLOCKS[ks[i]]
            }
        })
        BLOCK_COUNTER += 1
    })
}

TEMPLATE_BLOCKS = {
    'title_b': `<div class="title_b block_to_edit" id="_" style="cursor:pointer;border:0.5px solid black;background-color:#fff;padding:20px;"> <h1 style="text-align:center;font-size:40px;">Title</h1> <h2 style="text-align:center;font-size:20px;">Subtitle</h2><p style="font-size:20px;text-align:center;" ></p> </div>\n`,
    'text_b': `<div class="text_b block_to_edit" id="_" style="cursor:pointer;border:0.5px solid black;background-color:#fff;padding:20px;"><h1 style="font-size:40px;"></h1><h2 style="font-size:20px;"></h2> <p style="font-size:20px;" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, molestias architecto omnis eveniet alias error laudantium nemo libero praesentium odit harum asperiores, tempore nesciunt obcaecati repellendus. Saepe nihil quae laudantium!</p> </div>\n`,
    'columns_b': `<div class="columns_b block_to_edit" id="_" style="cursor:pointer;border:0.5px solid black;padding:20px;display:flex;justify-content:center;gap:80px;"><div style="width:500px;"><h1 style="text-align:center;font-size:20px;">Subtitle</h1> <p style="font-size:20px;text-align:center;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus eos assumenda odio alias, quia aperiam accusantium iure asperiores molestias mollitia</p></div><div style="width:500px;"><h1 style="text-align:center;font-size:20px;">Subtitle</h1> <p style="font-size:20px;text-align:center;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus eos assumenda odio alias, quia aperiam accusantium iure asperiores molestias mollitia</p></div></div>\n`
}
function visualizateBlock(block){
    sectionForBlocks.insertAdjacentHTML('beforeend', TEMPLATE_BLOCKS[block])
    // PAGE_DATA.push(TEMPLATE_BLOCKS[block])
}

// -----------------------------
// СОХРАНЕНИЕ локальных изменений и отправка их на сервер
saveBTN = document.querySelector('.header_buttons__button_save')
saveBTN.addEventListener('click', () => {
    // УДАЛЕНИЕ ЛИШНИХ СТИЛЕЙ
    // for (let i = 0; i < PAGE_DATA.length; i++) {
    //     html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')

    //     html_block.style.cursor = 'auto'
    //     html_block.style.border = '0px solid #fff'

    //     to_what = `${html_block.outerHTML}\n`
    //     PAGE_DATA[i].content.what = to_what
    // }
    load_PAGE_DATA_to_server(PAGE_DATA)

})
quitNoBTN = document.querySelector('.save_window_inputs_button_n')
quitNoBTN.addEventListener('click', () => {
    window.location.href = './profile.html'
})
quitYesBTN = document.querySelector('.save_window_inputs_button_y')
quitYesBTN.addEventListener('click', () => {
    window.location.href = './profile.html'
    load_PAGE_DATA_to_server(PAGE_DATA)
})


function load_PAGE_DATA_to_server(index){
    data = {
        'main': index,
        'username': localStorage.getItem('name'),
        'password': localStorage.getItem('password'),
        'site_id': SITE_ID
    }
    return fetch('http://127.0.0.1:8000/api/load_PAGE_DATA_to_server', {
        method: 'POST', 
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data),
        mode: 'no-cors'
    })
}