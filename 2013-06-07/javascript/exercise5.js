//mountains
domain = DOMAIN([[0,20],[0,15]])([24,12])
//array dove memorizzo le posizioni randomiche delle montagne)
var x = [];
var y = [];
var z = [];


var land = function(v){
		var a = v[0];
		var b = v[1];
		var u = a
		var v = b
		if (COS(a)*SIN(b)<0.1 && ((a>=0.02 && a<=7 && b>0.02 && b <14.98) 
			|| (a>7 && a<15 && b<8 && b>0.02) || (a > 16 && a<19.98 && b>10 && b<14.98)) ){
			    var w = 1 +2.5*Math.random();}
		else{
                var w =1};
        x.push(u)
        y.push(v)
        z.push(w)
		return [u,v,w];
}
depth = CUBOID([20,15,1])
mountain = MAP(land)(domain)
mountains = COLOR([205/255, 133/255, 63/255])(STRUCT([mountain,	depth]))

//lakes

l1 = T([0,1,2])([5,0,1.01])(CUBOID([4,3,0.1]))
l2 = T([0,1,2])([2.5,2.5,1.01])(CUBOID([3,3,0.1]))
l3 = T([0,1,2])([16.5,12.5,1.01])(CUBOID([3.5,2.5,0.1]))
lakes = COLOR([0,0.5,1])(STRUCT([l1,l2,l3]))


//trees

function cone(raggio,altezza){
	var domain = PROD1x1([INTERVALS(1)(20),INTERVALS(1)(6)]);
	var apex = [0,0,altezza];
	var funProfile = CUBIC_HERMITE(S0)([[raggio,0,0],[0,raggio,0],[0,2*raggio,0],[-2*raggio,0,0]]);
	var out1 = MAP(CONICAL_SURFACE(apex)(funProfile))(domain);
	var out2 = R([0,1])(PI)(out1)
	var out3 = STRUCT([out1,out2])
	var out4 = R([0,1])(PI/2)(out3)
	var out = STRUCT([out3,out4])
	return out;
}

function cylinder(r,h,discr){
	d = DISK(r)(discr)
	c = EXTRUDE([h])(d)
	return c
}

function tree(raggio,altezza,discr){
		base = COLOR([115/255, 74/255, 18/255])(cylinder(raggio/5,altezza,discr))
		cone1 = COLOR([0, 165/255, 80/255])(T([2])([2*altezza/3])(cone(raggio,2*altezza/3)))
		return STRUCT([base,cone1])
}
t = tree(0.25,0.8,20)
t1 = tree(0.3,0.9,20)


function forest(tree,x_in,x_fin,y_in,y_fin){
	s = ""
	for (i=0;i<x.length;i++){
		if((x[i]>=x_in && x[i]<x_fin) && (y[i]>=y_in && y[i]<y_fin))
					s = STRUCT([T([0,1,2])([x[i],y[i],z[i]])(tree),s])
			}
return s;
}
f1 = forest(t,0.2,3,0.2,14.98)
f2 = forest(t1,8,14,0.2,8)
f3 = forest(t,4,7.5,5.5,13)

forests = STRUCT([f1,f2,f3])

//human settlement

h_s = COLOR([0,1,0])(CUBOID([1,1,0.05]))

function village(lunghezza, altezza,d){
	house_x = lunghezza/(1+d)
	house_y = altezza/(1+d)
    var c1 = function(){return (0.2 + Math.random()*0.15)}
    var c2 = function(){return (0.4 + Math.random()*0.3)}
    var c3 = function(){return (0.4 + Math.random()*0.5)}

	s1 = ""
	for(i=0; i<house_x;i++){
		for(j=0; j<house_y;j++){
			s1 = STRUCT([T([0,1])([i*(1+d),j*(1+d)])(h_s),
                         T([0,1,2])([i*(1+d)+0.05,j*(1+d)+0.1,0.05])(COLOR([0.5,0.5,0.5 +Math.random()*0.5])(CUBOID([c1(),c2(),c3()]))),
                         T([0,1,2])([i*(1+d)+0.4,j*(1+d)+0.1,0.05])(COLOR([0.5,0.5,0.4 + Math.random()*0.6])(CUBOID([c1(),c2(),c3()]))),s1])
		}
	}
	return s1;
}


v1 = village(5,4,0.1)
village1 = T([0,1,2])([10,10,1.1])(v1)

v2 = village(3,6,0.1)
village2 = T([0,1,2])([16,1,1.1])(v2)

v3= village(1,3,0.1)
village3 = T([0,1,2])([8.9,11.1,1.1])(v3)

villages = STRUCT([village1,village2,village3])

//streets
function street(l,a,d){
	house_x = l/(1+d)
	house_y = a/(1+d)
	vet_x = []
	vet_y = []
	vet_z = [-1,0.1]
    vet_x.push(d)
	for(i=0; i<=house_x; i++){
		vet_x.push(-1)
    	vet_x.push(d)
	}
    vet_y.push(d)
	for(i=0; i<=house_y; i++){
        vet_y.push(-1)
		vet_y.push(d)
	}
    s_grid1 = SIMPLEX_GRID([vet_x,[a + house_y*d+0.1],vet_z]) 
    s_grid2 = SIMPLEX_GRID([[l+house_x*d+0.1],vet_y,vet_z]) 
	return STRUCT([s_grid1,s_grid2])

}
st1 = street(5,4,0.1)
street1 = T([0,1])([9.9,9.9])(st1)

st2 = street(3,6,0.1)
street2 = T([0,1])([15.9,0.9])(st2)

st3= street(1,3,0.1)
street3 = T([0,1])([8.8,11])(st3)


//stradina
var domain2D = PROD1x1([INTERVALS(1)(20),INTERVALS(1)(6)]);
st4 = BEZIER(S0)([[15.5,10.1,1.1],[19,8,1.1],[14,9,1.1],[17.3,7.5,1.1]])
st4map = MAP(st4)(INTERVALS(1)(32))
st5 = BEZIER(S0)([[15.4,9.9,1.1],[18.5,8.2,1.1],[13.5,9,1.1],[16.7,7.5,1.1]])
st5map = MAP(st5)(INTERVALS(1)(32))
street45 = MAP(BEZIER(S1)([st4,st5]))(domain2D)

streets = COLOR([1,1,1])(STRUCT([street1,street2,street3,street45]))

model = STRUCT([mountains,lakes,forests,villages,streets])


//DRAW(model)

