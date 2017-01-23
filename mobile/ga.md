## GA

### set

个人感觉准确的经纬度在 GA 里用处不大。
```
ga('set', 'dataSource', 'mobile');
ga('set', 'network', connection.type);
ga('set', 'plateform', device.platform);
ga('set', 'uuid', device.uuid);
ga('set', 'model', device.model);
ga('set', 'version', appVersin);
ga('set', 'latitude', latitude);
ga('set', 'longitude', longitude);
```
### pageview
```
ga('send', 'event', 'pageview', 'link', location.pathname, 1);
```

### click
```
ga('send', 'event', 'click', 'name', $rule_name, 1);
```

### watch 
```
ga('send', 'event', 'player', 'play', $video_id + '-' + $video_name, 1);
ga('send', 'event', 'player', 'error', $video_id + '-' + $video_name, 1);
ga('send', 'event', 'player', 'duration', $video_id + '-' + $video_name, $duration);
ga('send', 'event', 'player', 'current', $video_id + '-' + $video_name, $currentTime);
ga('send', 'event', 'player', 'watched', $video_id + '-' + $video_name, $calculated_time);
ga('send', 'event', 'player', 'rate', $video_id + '-' + $video_name, $calculated_time/$duration);
```

### pull
```
ga('send', 'event', 'pull', 'up',  $channel_name, 1);
ga('send', 'event', 'pull', 'down', $channel_name, 1);
```

### api time
ga('send', 'event', 'api', 'time', $url, $response_time);