let navbar = document.querySelector('.navbar');
document.addEventListener('scroll', ()=>{
    if(window.top.scrollY > 19){
        navbar.classList.add('scroll');
    }else{
        navbar.classList.remove('scroll');
        navbar.computedStyleMap.transition = '.4s ease';
    }
})