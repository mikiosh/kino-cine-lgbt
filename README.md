# Cine LGBT para Kino

Catálogo de películas LGBT con populares, recientes, romance, drama, comedia y documentales. Muestra carteles, sinopsis, año y puntuación. No entrega vídeos: Kino busca las opciones de reproducción en tus otros plugins mediante los identificadores TMDB.

## Instalar

1. Usa Kino 0.9.54 o posterior.
2. Abre Ajustes → Plugins → Agregar.
3. Escribe **mikiosh/kino-cine-lgbt** y pulsa Agregar → Instalar.
4. Abre una película del catálogo y usa **Buscar dónde verlo**. Necesitas otras fuentes instaladas y que alguna tenga el título.

Sin cuentas propias del plugin ni claves incrustadas. Usa el acceso a TMDB gestionado por Kino. Si Kino solicita una llave TMDB, configúrala en los ajustes de la app.

## Alcance y estado

Versión inicial 0.1.0, sin firma de autor. El catálogo usa etiquetas de TMDB relacionadas con LGBT, gay, lesbian, transgender y bisexual. La cobertura depende del etiquetado: puede haber omisiones y errores. La búsqueda revisa las etiquetas de los primeros 12 resultados por título; no es exhaustiva. Se excluyen entradas marcadas adult por TMDB; la temática LGBT no se trata por sí misma como contenido adulto. No ofrece un filtro propio de edades.

El manifiesto y las funciones pasan el validador oficial de Kino. Cinco pruebas locales con datos simulados comprueban identidad de títulos, caché, paginación, búsqueda temática e idioma/errores. Falta probar las respuestas reales de TMDB y la instalación en TV; estas pruebas no garantizan disponibilidad para reproducir.

## Créditos

Datos e imágenes de [TMDB](https://www.themoviedb.org/).

![TMDB](https://files.readme.io/29c6fee-blue_short.svg)

This product uses the TMDB API but is not endorsed or certified by TMDB.

Andamiaje basado en [kino-plugin-archive](https://github.com/kinotvapp/kino-plugin-archive), Apache-2.0. Consulta [la documentación oficial de plugins Kino](https://kinotvapp.github.io/kino-plugins/) para desarrollar y validar cambios. El paquete de desarrollo local incluye el kit y las pruebas; no es necesario para instalar este repositorio.
