<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model common\models\learning\LnCourseCategory */

?>
<div class="course-category-update">

<!--    <h1>--><?//= Html::encode($this->title) ?><!--</h1>-->

    <?= $this->render('_form', [
        'model' => $model,
        'companyModel' => $companyModel,
    ]) ?>

</div>
