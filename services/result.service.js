module.exports = {
    error(msg = '未知错误') {
        return {
            msg: msg,
            success: false
        }
    },
    success(msg = '操作成功', data){
        let result = {
            msg: msg,
            success:true,
        }
        data && (result.data = data)
        return result;
    }
}