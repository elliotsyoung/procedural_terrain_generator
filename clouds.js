$(document).ready(function(){

    console.log("Creating Clouds");

    const clouds = createClouds();

    // for(let cloud of clouds){
    //     console.log(`inserting cloud ${cloud.id}`);

    //     const cloudHTML = `<img class="cloud" id="cloud${cloud.id}" src="/image/Cloud.png"/>`
    //     $("#grid").append(cloudHTML);
    // }


    $(".cloud").hover(function(){
        $(this).fadeOut()
        setTimeout(() => {
            $(this).fadeIn();
        },7000)
    });

    setInterval(()=>{
        for(let cloud of clouds){
            let currentLeftPosition = parseInt($(`#cloud${cloud.id}`).css("left"));

            if( currentLeftPosition > 9000){
                currentLeftPosition = -400;
            }

            $(`#cloud${cloud.id}`).css("left", currentLeftPosition + cloud.speed)
            // const currentTopPosition = parseInt($(`#cloud${cloud.id}`).css("top"));
            // $(`#cloud${cloud.id}`).css("left", currentTopPosition + 5)
        }
    }, 100);

});


function createClouds(){
    let clouds = [];

    const cloud_count = game_options.cloud_count || 24;
    console.log(`creating ${cloud_count} clouds`);

    for(let i = 0; i < cloud_count; i++){

        const newCloud = {
            id: i,
            width: Math.floor(Math.random() * 1000) + 100,
            speed: Math.floor(Math.random() * 50) + 10,
            top: Math.floor(Math.random() * 3800) + 200,
            left: Math.floor(Math.random() * 7000) - 700

        };

        clouds.push(newCloud);

    }

    for(let cloud of clouds){
        $("body").append(`<img id="cloud${cloud.id}" class="cloud" src='./image/Cloud.png' style="top: ${cloud.top}px; left:${cloud.left}px; width:${cloud.width}px" />`);
    }

    console.log(`the clouds created are:`);
    console.log(clouds);

    return clouds;

}