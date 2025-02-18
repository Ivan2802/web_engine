// --------------------------------------------------------------
// При загрузке страницы
PAGE_DATA = [] // = Массив для отправки на сервер при сохранении
// ----- Получение id сайта из БД sites
function get_site_id_fromDB(){
    data = {
        name: localStorage.getItem('site_name')
    }
    return fetch('http://127.0.0.1:8000/api/get_site_id_fromDB', {
        method: 'POST', 
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
}
window.addEventListener('load', () => {
    get_site_id_fromDB()
        .then((data) => {return data.json()})
        .then((data) => {
            console.log(data)
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
// ---- Всплытие кнопок при наведегии на блок -----
editButtons = document.querySelector('.edit_set_btns')
addNewBlockBtn = document.querySelector('.edit_main_addbtn')



REDACTED_BLOCK_INDEX = 0
function vizSetBlockBTN(){
    mainBlocks = document.querySelectorAll('.block_to_edit')
    for (let i = 0; i < mainBlocks.length; i++) {
        mainBlocks[i].addEventListener('click', () => {
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
    mainBlocks[REDACTED_BLOCK_INDEX].remove()
    vizSetBlockBTN()
    if (mainBlocks.length == 0){
        hide(editButtons)
    }
})
moveDownBTN_block = document.querySelector('.edit_set_btns_right_arrow_down')
moveDownBTN_block.addEventListener('click', () => {
    rplsed = sectionForBlocks.replaceChild(mainBlocks[REDACTED_BLOCK_INDEX], mainBlocks[REDACTED_BLOCK_INDEX + 1])
    sectionForBlocks.insertBefore(rplsed, mainBlocks[REDACTED_BLOCK_INDEX])
    REDACTED_BLOCK_INDEX += 1
    vizSetBlockBTN()
})
moveUpBTN_block = document.querySelector('.edit_set_btns_right_arrow_up')
moveUpBTN_block.addEventListener('click', () => {
    rplsed = sectionForBlocks.replaceChild(mainBlocks[REDACTED_BLOCK_INDEX], mainBlocks[REDACTED_BLOCK_INDEX - 1])
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
    }catch{}
    try{
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').innerHTML = scText.value
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.color = scColor.value
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
// sbColor = document.querySelector('.set_block_inps_color_bg_inp')
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
    }catch{
        mainBlocks[REDACTED_BLOCK_INDEX].style.height = sbHeight.value
        mainBlocks[REDACTED_BLOCK_INDEX].style.width = sbWidth.value
        mainBlocks[REDACTED_BLOCK_INDEX].style.textAlign = sbLocation.value
        mainBlocks[REDACTED_BLOCK_INDEX].style.textAlign = sbLocation.value
        mainBlocks[REDACTED_BLOCK_INDEX].style.padding = sbPaddings.value
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


// Добавление собственно блока на страницу из списка добавления блоков
blocks = {
    'title_b': document.querySelector('#title_b'),
    'text_b': document.querySelector('#text_b'),
}
ks = Object.keys(blocks)
for (let i = 0; i < ks.length; i++) {
    blocks[ks[i]].addEventListener('click', () => {
        closePopUp(popupAddBlock)
        visualizateBlock(ks[i])
        vizSetBlockBTN()
        // mainBlocks[mainBlocks.length - 1].style.border = '5px solid rgb(8, 153, 8)';
        // show(editButtons)
    })
}
sectionForBlocks = document.querySelector('.edit_wrapper')
TEMPLATE_BLOCKS = {
    'title_b': `<div class="title_b block_to_edit" style="cursor:pointer;border:1px solid black;background-color:#fff;padding:20px;"> <h1 style="text-align:center;font-size:40px;">Title</h1> <h2 style="text-align:center;font-size:20px;">Subtitle</h2><p style="font-size:20px;text-align:center;" ></p> </div>`,
    'text_b': `<div class="text_b block_to_edit" style="cursor:pointer;border:1px solid black;background-color:#fff;padding:20px;"><h1 style="font-size:40px;"></h1><h2 style="font-size:20px;"></h2> <p style="font-size:20px;" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, molestias architecto omnis eveniet alias error laudantium nemo libero praesentium odit harum asperiores, tempore nesciunt obcaecati repellendus. Saepe nihil quae laudantium!</p> </div>`,

}
function visualizateBlock(block){
    sectionForBlocks.insertAdjacentHTML('beforeend', TEMPLATE_BLOCKS[block])
    // PAGE_DATA.push(TEMPLATE_BLOCKS[block])
}