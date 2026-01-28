let searchBtn = document.querySelector('.header_Button');
let searchbar = document.querySelector('.searchBar');
let closeBtn = document.getElementById('SearchClose');
let searchinput = document.getElementById('searchInput');

searchBtn.addEventListener('click',()=>{
  searchbar.style.visibility = "visible";
  searchbar.classList.add('open');
  searchinput.focus();

});

closeBtn.addEventListener("click", ()=>{
    searchbar.style.visibility = "hidden";
    searchbar.classList.remove('open')
})