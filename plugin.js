const ROWS = [
 {id:'popular',es:'Cine LGBT · Populares',en:'LGBT cinema · Popular',sort:'popularity.desc'},
 {id:'recent',es:'Cine LGBT · Recientes',en:'LGBT cinema · Recent',sort:'primary_release_date.desc'},
 {id:'romance',es:'Cine LGBT · Romance',en:'LGBT cinema · Romance',genre:10749},
 {id:'drama',es:'Cine LGBT · Drama',en:'LGBT cinema · Drama',genre:18},
 {id:'comedy',es:'Cine LGBT · Comedia',en:'LGBT cinema · Comedy',genre:35},
 {id:'documentary',es:'Cine LGBT · Documentales',en:'LGBT cinema · Documentaries',genre:99}
];
const GENRES={18:'drama',35:'comedia',10749:'romance',99:'documentales',53:'suspenso',27:'terror',28:'accion'};
const english=()=>String(kino.lang||'').startsWith('en');
const language=()=>english()?'en-US':'es-MX';
async function api(path,params={}) {
 await null;
 if(typeof kino.tmdb!=='function') throw kino.error('unavailable','Actualiza la aplicación para usar el catálogo.');
 return kino.tmdb(path,params);
}
async function keywordIds() {
 await null;
 const cached=kino.storage.get('keywords-v1');
 if(cached) { try {const ids=JSON.parse(cached); if(Array.isArray(ids)&&ids.length&&ids.every(x=>Number.isInteger(x)&&x>0)) return ids;}catch(_){} }
 const pages=await Promise.all(['lgbt','gay','lesbian','transgender','bisexual'].map(query=>api('/search/keyword',{query,page:1})));
 const ids=[...new Set(pages.flatMap(p=>(p.results||[]).filter(k=>/^(lgbt[A-Za-z]*|gay|lesbian|transgender|bisexual)( |$)/i.test(k.name||'')).map(k=>k.id)).filter(id=>Number.isInteger(id)&&id>0))].slice(0,45);
 if(!ids.length) throw kino.error('unavailable','No se encontraron las etiquetas del catálogo.');
 kino.storage.set('keywords-v1',JSON.stringify(ids),{ttlMs:604800000});
 return ids;
}
function item(m) {
 return {id:'movie-'+m.id,ref:String(m.id),kind:'movie',title:m.title||m.original_title,
 originalTitle:m.original_title,year:(m.release_date||'').slice(0,4),ids:{tmdb:m.id},
 poster:m.poster_path?'https://image.tmdb.org/t/p/w500'+m.poster_path:undefined,
 backdrop:m.backdrop_path?'https://image.tmdb.org/t/p/w1280'+m.backdrop_path:undefined,
 overview:m.overview||undefined,rating:m.vote_average||undefined,
 genres:(m.genre_ids||[]).map(id=>GENRES[id]).filter(Boolean).slice(0,5)};
}
async function discover(row,page,ids) {
 const params={language:language(),with_keywords:ids.join('|'),include_adult:false,sort_by:row.sort||'popularity.desc',page,'primary_release_date.lte':new Date().toISOString().slice(0,10)};
 if(row.genre) params.with_genres=String(row.genre);
 const data=await api('/discover/movie',params);
 return {items:(data.results||[]).filter(m=>!m.adult).map(item),next:page<Math.min(data.total_pages||1,500)?String(page+1):undefined};
}
export async function home() {
 const ids=await keywordIds();
 const pages=await Promise.all(ROWS.map(row=>discover(row,1,ids)));
 return ROWS.map((row,i)=>({id:row.id,title:english()?row.en:row.es,genre:row.id==='documentary'?'documentales':'peliculas',ref:row.id,items:pages[i].items}));
}
export async function browse(ref,cursor) {
 await null;
 const row=ROWS.find(r=>r.id===ref),page=cursor==null||cursor===''?1:Number(cursor);
 if(!row||!Number.isInteger(page)||page<1||page>500) throw kino.error('not_found','Página inexistente.');
 return discover(row,page,await keywordIds());
}
export async function search(query) {
 await null;
 if(!query||!String(query.q||'').trim()||(query.type&&!['any','movie'].includes(query.type))) return [];
 const ids=new Set(await keywordIds());
 const params={query:String(query.q).slice(0,200),language:language(),include_adult:false,page:1};
 if(query.year) params.year=query.year;
 const data=await api('/search/movie',params);
 const candidates=(data.results||[]).filter(m=>!m.adult).slice(0,12),matches=[];
 for(let i=0;i<candidates.length;i+=6) {
  const batch=await Promise.all(candidates.slice(i,i+6).map(async m=>{
   const tags=await api('/movie/'+m.id+'/keywords');
   return (tags.keywords||[]).some(k=>ids.has(k.id))?item(m):null;
  }));
  matches.push(...batch.filter(Boolean));
 }
 return matches;
}
export async function resolve() {
 await null;
 throw kino.error('not_found','Catálogo sin reproducción.');
}
