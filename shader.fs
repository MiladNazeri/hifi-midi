const float W = 4.0;
const float T = 0.05;
float filmic_reinhard_curve (float x) {
    float q = (T + 1.0)*x*x;
	return q / (q + x + T);
}

vec3 filmic_reinhard(vec3 x) {
    float w = filmic_reinhard_curve(W);
    return vec3(
        filmic_reinhard_curve(x.r),
        filmic_reinhard_curve(x.g),
        filmic_reinhard_curve(x.b)) / w;
}

mat3 orient(in vec3 v,in vec3 d)
{
	v = normalize(v);
	vec3 i = normalize(cross(v, normalize(d)));
	return mat3(i, cross(i, v), v);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = -1.0+2.0*fragCoord.xy / iResolution.xy;
    uv.x *= iResolution.x/iResolution.y;

    float position = iTime*100.0;

    // origo and lookat points
    vec3 o = vec3(sin(iTime*0.478)*8.0,cos(iTime*0.513)*8.0, iTime*100.0);
	vec3 t = vec3(sin(iTime*0.509)*200.0,cos(iTime*0.437)*200.0, -1000.0);
	// oriented direction vectors (yes I like my up vectors like that shut your up)
	vec3 d = normalize(vec3(uv, 2.0)*orient(t, normalize(vec3(0,1,2)) ));

    vec3 tv = vec3(1);
    vec3 ac = vec3(0);
    vec3 i = vec3(0);
    float aid = 0.0;

    for(int l = 0; l < 32; l++)
    {
        float off = 3.0*(1.0*pow(length(tv),2.0) );
        aid += off;
        float r = 32.0 - off;

        float a = d.x*d.x + d.y*d.y;
        float b = 2.0*(o.x*d.x + o.y*d.y);
        float c = o.x*o.x + o.y*o.y - r*r;

        float delta = b*b - 4.0*a*c;

        float t1 = (-b - sqrt(delta))/(2.0*a);
        float t2 = (-b + sqrt(delta))/(2.0*a);
        float t = min(t1, t2);

        i = o + t*d;

        //vec2 co = vec2((i.z)*0.2, (atan(i.y, i.x)*32.0/3.1416));
        //tv = textureLod(iChannel0, co*0.01, 1.0).rgb;
        vec2 co = vec2((i.z)*0.2,
                       atan(i.y, i.x)*32.0/3.1416);
        tv = texture(iChannel0, co*0.007).rgb;  //.grb*vec3(1.12,0.94,1.02);
        vec2 c2 = vec2((i.z)*0.2,
                       abs(atan(i.y, i.x)*32.0/3.1416));
        vec3 te = texture(iChannel0, c2*0.007).rgb;
        tv = mix(tv, te, smoothstep(0.0,0.7,atan(i.y, i.x))+smoothstep(3.1416-0.7,3.1416,-atan(i.y, i.x)));
        /*
        co = vec2(abs(i.z)*0.07,
                       abs(atan(i.y, i.x)*11.0/3.1416));
        tv += 0.5*texture(iChannel0, co*0.01).rgb;
		*/
        ac += pow(tv, vec3(2.2))/32.0;
    }

    ac /= pow(smoothstep(0.0, 1.0, 1.0/pow(distance(o, i)*0.02, 2.0)), 0.5);
    ac /= pow(aid, 0.5)*0.1;


    // vignette
    float rf = sqrt(dot(uv, uv)) * 0.3;
    float rf2_1 = rf * rf + 1.0;
    ac *= 1.0 / (rf2_1 * rf2_1);
    // tonemap
    ac = filmic_reinhard(ac);
    ac = smoothstep(-0.12, 1.0, ac);

	fragColor.rgb = pow(ac, vec3(0.4545));
}
