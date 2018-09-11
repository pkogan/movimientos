/**
 * Created by pablo-user on 18/04/16.
 */

/*
SIEMPRE ME MUEVO A LA MAXIMA VELOCIDAD
Formulas para el seek behavior

 1. vector(desired velocity) = (target position) – (vehicle position)   :  se crea un vector desde el vehiculo hasta el target
 2. normalize vector(desired velocity)                                  :  se normaliza dicho vector, es decir, se lo lleva a un vector unitario con dicho sentido
 3. scale vector(desired velocity) to maximum speed                     :  se le da la magnitud de la maxima velocidad. Multiplicar por un scalar
 4. vector(steering force) = vector(desired velocity) – vector(current velocity)  se calcula la fuerza que dirigira el vehiculo al target.
 5. limit the magnitude of vector(steering force) to maximum force                se limita la fuerza a una maxima fuerza
 6. vector(new velocity) = vector(current velocity) + vector(steering force)      se calcula el nuevo vector de velocidad para el vehiculo
 7.  se la limita a la maxima velocidad
 */

var config = {
        type: Phaser.AUTO,
        width: 1000,
        height: 1000,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 }
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        backgroundColor : "#FFFFFF"
    };

    /*var game = new Phaser.Game(
        1024, 600, Phaser.AUTO, 'gameDiv',
        {preload: preload, create: create, update: update}
    );*/
    

    var vecReference = new Phaser.Geom.Point(0, 0);

    var misil;

    var target;
    var game = new Phaser.Game(config);

    function preload ()
    {

        this.load.image('misil', 'assets/misil.png');
        this.load.image('target', 'assets/target.png');
    }

    function create(){
        //this.stage.backgroundColor = "#FFFFFF";
        //this.physics.arcade.startSystem();
        
        //misil = this.physics.add.sprite(this.canvas.width/2,this.canvas.height/2,'misil');//(this.world.centerX, this.world.centerY, 'misil');
        misil = this.physics.add.sprite(400,300,'misil');
//misil.anchor.setTo(0.5, 0.5);
        misil.setScale(0.2);
        //this.physics.enable(misil, Phaser.Physics.ARCADE);
        //this.physics.enable(misil, Phaser.Physics.ARCADE);

        misil.MAX_SPEED = 400 ;
        misil.MAX_DIST = 200;
        misil.MAX_SPEED_SQ = misil.MAX_SPEED * misil.MAX_SPEED;
        misil.body.collideWorldBounds = true;
        //misil.body.collideWorldBounds = true;
        target = this.physics.add.sprite(this.input.x, this.input.y, 'target');
        //target.anchor.setTo(0.5, 0.5);
        target.setScale(0.5);
    }

    function update(){
        target.setPosition(this.input.mousePointer.x, this.input.mousePointer.y);

        seek(misil, target);
    }

     function seek(vehiculo, objetivo){
         //Obtengo VectorDeseado
         var VectorDeseado = calcularVelocidadDeseada(vehiculo, objetivo);
         
         //Obtengo el vector Steering
         var vectorSteeringForce = calcularSteeringForce(vehiculo.body.velocity, VectorDeseado);

         //aplico el vector de fuerza al vehiculo
         aplicarVectorDeFuerza(vehiculo,vectorSteeringForce);

    }

function calcularVelocidadDeseada(vehiculo,objetivo) {
     // Calculo el vector deseado = normalizado(POSICION TARGET - POSICION VEHICULO) * maximaVelocidad

     var VectorDeseado=new Phaser.Math.Vector2(objetivo.x,objetivo.y);
     //VectorDeseado.subtract(new Phaser.Math.Vector2(vehiculo.x,vehiculo.y));
     //var VectorDeseado=objetivo;
     VectorDeseado.subtract(vehiculo);
     
     
     //Arrive
     distancia=VectorDeseado.length();
     
     VectorDeseado.normalize();
     VectorDeseado.multiply(new Phaser.Math.Vector2(vehiculo.MAX_SPEED, vehiculo.MAX_SPEED));
     
     //Arrive
     if(distancia<misil.MAX_DIST){
         valor=distancia / misil.MAX_DIST;
         VectorDeseado.multiply(new Phaser.Math.Vector2(valor, valor));
     }
     /***********************/
     
//flee
     //VectorDeseado.multiply(new Phaser.Math.Vector2(-vehiculo.MAX_SPEED, -vehiculo.MAX_SPEED));
    return VectorDeseado;
 }

function calcularSteeringForce(vehiculo,VectorDeseado){
    // Calculo el vector Steering VectorDeseado-Velocidad

    var vectorSteeringForce = VectorDeseado;
    vectorSteeringForce.subtract(vehiculo);
    return vectorSteeringForce;
}

function aplicarVectorDeFuerza(vehiculo,vectorSteeringForce){

    //Calculo la nueva velocidad y posicion del vehiculo sumando la posicion con el vector de fuerza
    vehiculo.angle=vehiculo.body.velocity.angle()*57.2958;
    vehiculo.body.velocity.add(vectorSteeringForce);

}


