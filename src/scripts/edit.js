// --------------------------------------------------------------
// При загрузке страницы
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
dtnClosePopUp = document.querySelector('.save_window_cross')
dtnClosePopUp.addEventListener('click', () => {
    closePopUp(isSavePopUp)
})

// ------------------------
// ---- Всплытие кнопок при наведегии на блок -----
mainBlock = document.querySelector('.edit_main')
editButtons = document.querySelector('.edit_set_btns')
addNewBlockBtn = document.querySelector('.edit_main_addbtn')
mainBlock.addEventListener('mouseover', () => {
    show(editButtons)
    show(addNewBlockBtn)
})
mainBlock.addEventListener('mouseout', () => {
    hide(editButtons)
    hide(addNewBlockBtn)
})
addNewBlockBtn.addEventListener('mouseover', ()=>{
    show(addNewBlockBtn)
})
addNewBlockBtn.addEventListener('mouseout', ()=>{
    hide(addNewBlockBtn)
})

// ----------------------------------
// НАСТРОЙКА КОНТЕНТА И БЛОКА
setContent = document.querySelector('.set_content')
setContentCross = document.querySelector('.set_content_img_cross')
setContentBtn = document.querySelector('.edit_set_btns_left_content')
setContentBtn.addEventListener('click', () => {
    show(setContent, 1)
})
setContentCross.addEventListener('click', () => {
    hide(setContent, 1)
})
// ----- Блок насройки блока
btnSetBlock = document.querySelector('.edit_set_btns_left')
setBlock = document.querySelector('.set_block')
setBlockCross = document.querySelector('.set_block_img_cross')
btnSetBlock.addEventListener('click', () => {
    show(setBlock, 1)
})
setBlockCross.addEventListener('click', () => {
    hide(setBlock, 1)
})