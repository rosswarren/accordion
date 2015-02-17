document.body.innerHTML = __html__['_site/index.html'];
function appendCSS(fileObj){
    var  link = document.createElement('link'); link.rel = 'stylesheet'; link.href='base/' + fileObj.path;  document.body.appendChild(link)
}
appendCSS({path: '_site/styles/demo.css'});
appendCSS({path: '_site/styles/accordion.css'});

var accordion = skyComponents['accordion'];

describe('accordion module can ', function () {

    it('sum an array of numbers', function () {

        expect(accordion.sum([1,2,3])).toBe(6);

    });

});