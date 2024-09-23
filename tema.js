function trocarTema() {
    const body = document.body;

    // Verifica qual tema tá aplicado
    if (body.classList.contains('temaclaro1', 'temaclaro2')) {
        // Muda pro tema escuro
        body.classList.remove('temaclaro1', 'temaclaro2',);
        body.classList.add('temaescuro');
    } else if (body.classList.contains('temaescuro')) {
        // Volta pro tema claro
        body.classList.remove('temaescuro');
        body.classList.add('temaclaro1');
    }
}