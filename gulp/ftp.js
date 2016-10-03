const
    gulp = require('gulp'),
    ftp  = require('vinyl-ftp');



module.exports = (config) =>{
  var ftpConfig = {
    host: config.ftp.host,
    user: config.ftp.user,
    password: config.ftp.password,
    parallel: 10
  }
  return {
    clean:(cb)=>{
      var conn = ftp.create(ftpConfig);
      return conn.rmdir('/www/www.mutualab.org/www', function() {
        return cb();
      });
    },
    send:()=>{
      var 
        conn = ftp.create(ftpConfig),
        globs = ["dist/**/*"];

      return gulp.src(globs, {
        base: "dist/",
        buffer: false
      }).pipe(conn.dest('/www/www.mutualab.org/www'));
    },

    chmod:()=>{
      var conn;
      conn = ftp.create(ftpConfig);
      conn.mode('www/www.mutualab.org/www',0777);
    }

  }
}


