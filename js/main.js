var panel = document.getElementById( 'panel' );
var content = document.getElementById( 'content' );
var viewer = document.getElementById( 'viewer' );
var panelScrim = document.getElementById( 'panelScrim' );

panelScrim.onclick = function ( event ) {
    event.preventDefault();
    panel.classList.toggle( 'open' );
};

var container = document.createElement( 'div' );
content.appendChild( container );

var links = {};
var selected = null;
function createLink( file ) {
    var link = document.createElement( 'a' );
    link.className = 'link';
    link.href = file + '.html';
    
    link.textContent = getName( file );
    link.appendChild(document.createElement('br'))
    link.setAttribute( 'target', 'viewer' );
    link.addEventListener( 'click', function ( event ) {
        if ( event.button !== 0 || event.ctrlKey || event.altKey || event.metaKey ) return;
        selectFile( file );
    } );
    return link;
}
for ( var key in exercices ) {
    var section = exercices[ key ];
    var header = document.createElement( 'h2' );
    header.textContent = key;
    header.setAttribute( 'data-category', key );
    container.appendChild( header );

    for ( var i = 0; i < section.length; i ++ ) {
        var file = section[ i ];
        var link = createLink( file );
        container.appendChild( link );
        links[ file ] = link;
    }
}
function loadFile( file,FromLinks ) {
    if (FromLinks)
    selectFile( file );

    viewer.src = file + '.html';

}
function selectFile( file ) {

    if (links!== null )
    {if ( selected !== null ) links[ selected ].classList.remove( 'selected' );
    links[ file ].classList.add( 'selected' );}

    window.location.hash = file;
    viewer.focus();
    panel.classList.remove( 'open' );
    selected = file;
}
if ( window.location.hash !== '' && links[ window.location.hash.substring( 1 ) ] ) {
    loadFile( window.location.hash.substring( 1 ), true);
}
else 
{

    loadFile('accueil', false);
}

function getName( file ) {
    var name = file.split( '_' );
    name.shift();
    return name.join( ' ' );
}