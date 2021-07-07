<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;
   // подключаю файлы из папки плагина
	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';
   // объявление плагина
	$mail = new PHPMailer(true);
	// настройка кодировки
	$mail->CharSet = 'UTF-8';
	// подключает языковой файл
	$mail->setLanguage('ru', 'phpmailer/language/');
	// подключает возможность HTML-тегов в письме
	$mail->IsHTML(true);

	// от кого письмо
	$mail->setFrom('infosundayschoool@gmail.com');
	// кому отправить
	$mail->addAddress('infosundayschoool@gmail.com');
	// тема письма
	$mail->Subject = 'Новая заявка';

	// тело письма
	$body = '<h1>Запишите меня на занятия: </h1>';
	// проверяю заполнены ли поля
	if(trim(!empty($_POST['name']))){
		$body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
	}
	if(trim(!empty($_POST['email']))){
		$body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
	}
	if(trim(!empty($_POST['tel']))){
		$body.='<p><strong>Телефон:</strong> '.$_POST['tel'].'</p>';
	}
	
	// переменная  плагина в
	$mail->Body = $body;

	// отправка
	if (!$mail->send()) {
		$message = 'Ошибка';
	} else {
		$message = 'Данные отправлены!';
		
	}

	$response = ['message' => $message];
   // возращает ответ в формате json
	header('Content-type: application/json');
	echo json_encode($response);
?>