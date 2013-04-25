<script>
    window.wpQuiz = {};
    var wpq = window.wpQuiz;
    wpq.answers = <?= $answers ?>;
    wpq.answers.correct = <?= $correct ?>;
    wpq.answerSelect = '#answerSelect';
    wpq.answerInput = '#answerInputs';
    wpq.inputTempl = '#inputTemplate';
    wpq.post_id = <?= $post->ID ?>;
	
</script>