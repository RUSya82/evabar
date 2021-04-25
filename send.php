<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

// Переменные, которые отправляет пользователь

$json = file_get_contents('php://input');
$obj = json_decode($json, true);
$name = $obj['user-name'];
$email = $obj['user-email'];
$message = $obj['user-message'];

// Формирование самого письма
$title = 'Новая заявка с сайта EVABAR.BY';
$body = "
<div>
<h2>$title</h2>
<b>Имя:</b> $name<br>
<b>E-mail  :</b> $email<br>
<b>Сообщение:</b> $message<br>";




// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth = true;
    $mail->SMTPDebug = 2;
    //$mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

    // Настройки вашей почты
    $mail->Host = 'smtp.gmail.com'; // SMTP сервера вашей почты
    $mail->Username = 'im.rusalim.ne@gmail.com'; // Логин на почте
    $mail->Password = 'Enk-Yrs-NKc-ggU'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;
    $mail->setFrom('im.rusalim.ne@gmail.com', 'Инновационные коврики для авто - evabar.by'); // Адрес самой почты и имя отправителя

    // Получатель письма
    //$mail->addAddress('salexandervl@gmail.com');
    $mail->addAddress('mail-spam2012@yandex.ru');

// Отправка сообщения
    $mail->isHTML(true);
    $mail->Subject = $title;
    $mail->Body = $body;

// Проверяем отравленность сообщения
    if ($mail->send()) {
        $result = "success";
    } else {
        $result = "error";
    }

} catch (Exception $e) {
    $result = "error";
    $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}
echo $result;


