
// --------------------------------------------------------------
// При загрузке страницы
// ---- Загрузка имени в профиль при зарузке страницы
nameSite = document.querySelector('.settings_main_title_name')
nameSiteInput = document.querySelector('.settings_main_input_name_input ')
statusSite = document.querySelector('.settings_main_input_status_stat')
function get_user_data_for_profile(){
    data = {
        user: {'name': localStorage.getItem('name'), 'password': localStorage.getItem('password')}
    }
    return fetch('http://127.0.0.1:8000/api/get_user_data_for_profile',  {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
}
// ---- Настройка определенной страницы сайта
function set_current_site(data, index_site){
    return fetch('http://127.0.0.1:8000/api/set_site', {
        method: 'POST', 
        headers: {'Accept':'application/json', 'Content-Type':'application/json'},
        body: JSON.stringify({name: data[index_site].name})
    })
}
nameProfileField = document.querySelector('.header_profile_name')
window.addEventListener('load', () => {
    nameProfileField.innerHTML = atob(localStorage.getItem('name'))

    get_user_data_for_profile()
    .then((data) => {return data.json()})
    .then((data) => {
        countSites = data.length

        // ----- Настройка 
        index_site = localStorage.getItem('list_id_site') 
        set_current_site(data, index_site)
            .then((data2) => {return data2.json()})
            .then((data2) => {
                nameSite.innerHTML = data2.name
                nameSiteInput.value = data2.name
                statusSite.innerHTML = data2.status

                // ---------- Созранить изменения
                btnSaveChanges = document.querySelector('.settings_main_input_name_save ')
                btnSaveChanges.addEventListener('click', () => {
                    return fetch('http://127.0.0.1:8000/api/change_settings', {
                        method: 'POST', 
                        headers: {'Accept':'application/json', 'Content-Type':'application/json'},
                        body: JSON.stringify({name_old: data2.name, name_new: nameSiteInput.value})
                    }).then(() => {
                        window.location.href = './profile.html'
                    })
                })

                // ----- Удаление сайта
                btnDeleteSite = document.querySelector('.settings_main_input_buttons_del')
                btnDeleteSite.addEventListener('click', () => {
                    return fetch('http://127.0.0.1:8000/api/delete_site', {
                        method: 'POST', 
                        headers: {'Accept':'application/json', 'Content-Type':'application/json'},
                        body: JSON.stringify({name_old: data2.name})
                    }).then(() => {
                        window.location.href = './profile.html'
                    })
                })
        })
    })
})


// ----- SETTINGS -----
btnGoOut = document.querySelector('.header_buttons__button_out')

// Выход из аккаунта
function del_local_storage(){
    localStorage.removeItem('name')
    localStorage.removeItem('password')
}
btnGoOut.addEventListener('click', () => {
    del_local_storage()
    window.location.href = './index.html'
})

// ----- Назад кнопка
btnGoBack = document.querySelector('.settings_button_back')

btnGoBack.addEventListener('click', () => {
    window.location.href = './profile.html'
})

