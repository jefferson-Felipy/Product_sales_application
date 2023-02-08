const menu_hamburguer = document.querySelector('#menu_hamburguer');
const menu_list = document.querySelector('.menu_list');
const fechar_menu = document.querySelector('.fechar_menu');
const body = document.querySelector('body');

menu_hamburguer.addEventListener('click',() => {
    body.style.backgroundColor = 'rgb(62, 60, 60)';
    menu_list.classList.add('add');
});

fechar_menu.addEventListener('click',() => {
    menu_list.classList.remove('add');
    body.style.backgroundColor = '#fff';
});

//---------------------------------------------------------------

const mudar_img = document.querySelectorAll('.img_senha');

const img_senha = () => {
    const senha1 = document.querySelector('.senha1');

    if(senha1.type === "password")
    {
        senha1.type = "text";
        mudar_img[0].src = "/imagens/olho.png";
    }
    else
    {
        senha1.type = "password";
        mudar_img[0].src = "/imagens/ver.png";
    }
}

const img_senha2 = () => {
    const senha2 = document.querySelector('.senha2');

    if(senha2.type === "password")
    {
        senha2.type = "text";
        mudar_img[1].src = "/imagens/olho.png";
    }
    else
    {
        senha2.type = "password";
        mudar_img[1].src = "/imagens/ver.png";
    }
}

//---------------------------------------------------------------