<?php

use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\ActiveForm;

?>

<style>
    /*label{display: none;}*/
</style>

<script>
    $("#search").on('click', function(){
//        alert('reset');
        reloadForm();
    });

    $("#reset").on('click', function(){
        //        alert('reset');
        clearForm("searchForm");
    });
</script>
<div class="list-search-form">

    <?php $form = ActiveForm::begin([
        'id' => 'searchForm',
        'action' => ['list'],
        'method' => 'get',
    ]); ?>

    <table  border="0">
        <tr>
            <td>
                <?= $form->field($model, 'point_code')->textInput() ?>
            </td>
            <td>
                <?= $form->field($model, 'point_name')->textInput() ?>
            </td>
            <td>
                <?= $form->field($model, 'status')->dropDownList([
                    '1'=>Yii::t('common','status_normal'),
                    '2'=>Yii::t('common','status_stop')],
                    ['prompt'=>Yii::t('common','all_data')]) ?>
            </td>
            <td>
                <?= Html::button(Yii::t('common', 'search'), ['class' => 'btn btn-primary', 'id'=>'search']) ?>
                <?= Html::button(Yii::t('common', 'reset'), ['class' => 'btn btn-default', 'id'=>'reset']) ?>
            </td>
        </tr>
    </table>
    <?php ActiveForm::end(); ?>

</div>