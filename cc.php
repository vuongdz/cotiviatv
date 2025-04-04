<?php
function getLink()
{
    $url = urlencode($datae['url']);
    $id = $datae['id'];
    $df = "$url|$id|$match_id";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://y.zoomplayer.xyz/v15/?url=" . $url . "&id=$match_id&n=$id&t=br&p=no&autoplay=1&theme_id=tc&df=$df");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        "referer: https://da.thapcam55.org/"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    $datauri =  curl_exec($ch);
    curl_close($ch);
}
