const forumLatest = "https://cdn.freecodecamp.org/curriculum/forum-latest/latest.json";
const forumTopicUrl  = "https://forum.freecodecamp.org/t/";
const forumCategoryUrl = "https://forum.freecodecamp.org/c/";
const avatarUrl = "https://sea1.discourse-cdn.com/freecodecamp";
const postsContainer = document.getElementById('posts-container');
//Objeto para guardar todas las categorias disponibles de los temas del foro con sus nombres de clase.
const allCategories = {
    299: {category: 'Career Advice', className: 'career'},
    409: {category: 'Project Feedback', className: 'feedback'},
    417: {category: 'Freecodecamp Support', className: 'support'},
    421: { category: "JavaScript", className: "javascript" },
    423: { category: "HTML - CSS", className: "html-css" },
    424: { category: "Python", className: "python" },
    432: { category: "You Can Do This!", className: "motivation" },
    560: { category: "Back-End Development", className: "backend" },
};

//Funcion encargada de los avatars de los usuarios participantes del tema.
const avatars = (posters, users)=>{
    //Buscando el usuario que le pertenece al poster
    return posters.map((poster)=>{
        const user = users.find((user)=> user.id === poster.user_id);

        //Si existio un usuario
        if(user){
            const avatar = user.avatar_template.replace(/{size}/, 30);
            const userAvatarUrl = avatar.startsWith('/user_avatar/') ? avatarUrl.concat(avatar) : avatar;
            return `<img src="${userAvatarUrl}" alt="${user.name}">`
        }
    }).join('');
}

const forumCategory = (id)=>{
    let selectedCategory = {};
    //verificando si nuestro objeto tiene el id como propiedad.
    if(allCategories.hasOwnProperty(id)){
        const {className, category} = allCategories[id];
        selectedCategory.className = className;
        selectedCategory.category = category;
    }else {
        selectedCategory.className = 'general',
        selectedCategory.category = 'General',
        selectedCategory.id = 1;
    }
    //Url de la categoria seleccionada.
    const url = `${forumCategoryUrl}${selectedCategory.className}/${id}`;
    const linkText = selectedCategory.category;
    const linkClass = `category ${selectedCategory.className}`;
    return `<a href="${url}" class="${linkClass}" target="_blank">${linkText}</a>`;
}
//Funcion encargada de calcular el tiempo transcurrido de la publicación.
function timeAgo(time){
    const currentTime = new Date();
    const lastPost = new Date(time);
    //Tiempo en milisegundos transcurridos a la fecha actual.
    const timeDifference = currentTime - lastPost;
    const msPerMinute = 1000 * 60;//calculando milisegundos que representan un minuto.
    
    const minutesAgo = Math.floor(timeDifference / msPerMinute);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);

    //Validando si la publicación esta en minutos transcurridos.
    if(minutesAgo < 60){
        return `${minutesAgo}m ago`;
    }
    //Validando si la publicación esta en horas trasncurridas.
    if(hoursAgo < 24){
        return `${hoursAgo}h ago`;
    }
    //Entonces sera dias transcurridos.
    return `${daysAgo}d ago`;
}
//Funcion encargada de mejorar el formato de numeros de vistas.
function viewCount(views){
    if(views >= 1000){
        return `${Math.floor(views / 1000)}k`;
    }else{
        return views;
    }
}

//Funcion que se ejecuta independiente del flujo principal para traer datos.
const fetchData = async ()=>{
    try{
        const res = await fetch(forumLatest);
        const data = await res.json();
        showLatestPosts(data);
    }catch(err){
        console.log(err);
    }
}

fetchData();

const showLatestPosts = (data)=>{
    const {topic_list, users} = data;
    const {topics} = topic_list;

    postsContainer.innerHTML = topics.map((item)=>{
        const {id, title, views, posts_count, slug, posters, category_id, bumped_at} = item;
        return `
        <tr>
            <td>
             <p class="post-title">${title}</p>
             ${forumCategory(category_id)}
            </td>
            <td>
                <div class="avatar-container"></div>
            </td>
            <td>${posts_count - 1}</td>
            <td>${viewCount(views)}</td>
            <td>${timeAgo(bumped_at)}</td>
        </tr>`
    }).join('');
}