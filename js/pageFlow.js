$(document).ready(function(){
    $("#step2").hide();
    $(document).ready(function(){
    $('.mainHeading').slideDown(800);
});
    $("#go").on("click", function(){     
        $("#step2").slideDown(500);
        $(this).fadeOut("slow");
    }); 
});


