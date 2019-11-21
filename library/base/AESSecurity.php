<?php 
/**
 * 功能描述：AES加密 填充方式为pkcs5 然后再用base64加密 最后用URL编码
 * 
 * @package    
 * @module   
 * @createdate   2015-6-29
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyright  2013 上海翼思信息科技有限公司 版权所有
 */
class AESSecurity {
    
    //对称加密密匙
    public static $AES_KEY = 'YouDeMai@@Lemall';
    
    /**
     * 功能描述：加密
     */
    public static function encrypt($inputText){
        $key = AESSecurity::$AES_KEY;
        $size = mcrypt_get_block_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_ECB);
        $inputText = AESSecurity::pkcs5_pad($inputText, $size);
        $td = mcrypt_module_open(MCRYPT_RIJNDAEL_128, '', MCRYPT_MODE_ECB, '');
        $iv = mcrypt_create_iv (mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
        mcrypt_generic_init($td, $key, $iv);
        $data = mcrypt_generic($td, $inputText);
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);
        $data = base64_encode($data);
        return $data;
    }
    
    private static function pkcs5_pad($text, $blocksize){
        $pad = $blocksize-(strlen($text) % $blocksize);
        return $text.str_repeat(chr($pad), $pad);
    }
    
    /**
     * 功能描述：解密
     */
    public static function decrypt($text){
        $key = AESSecurity::$AES_KEY;
        $iv = mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_ECB), MCRYPT_RAND);
        $decrypted= mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, base64_decode($text), MCRYPT_MODE_ECB, $iv);
        $dec_s = strlen($decrypted);
        $padding = ord($decrypted[$dec_s-1]);
        $decrypted = substr($decrypted, 0, -$padding);
        return $decrypted;
    }
}