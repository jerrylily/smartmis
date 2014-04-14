# coding=utf-8
from rest_framework.renderers import JSONRenderer

class PhotoJSONRenderer(JSONRenderer):
    """
        重载JsonRender，将结果集加入到 results:[]
        ExtJS的store 要求 get、update 所得到的结果格式 results:[] 但是 put 的结果不放入result
    """
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response_data = {}
        
        #if renderer_context.get('request').method == 'GET':
            # GET does not add root
        # delete 时 data=None，先判断data是否为 dict
        if isinstance(data, dict) and data.has_key('results'):
            response_data = data
        else: 
            #determine the resource name for this request - default to data if not defined
            resource = getattr(renderer_context.get('view').get_serializer().Meta, 'resource_name', 'results')
            response_data[resource] = data
        
        # POST 的结果将加上success,对应extjs的ajax结果处理格式
        # {success: true, msg: xxxx}
        if renderer_context.get('request').method == 'POST':
            response_data['success'] = True
        
        #call super to render the response
        response = super(PhotoJSONRenderer, self).render(response_data, accepted_media_type, renderer_context)
        
        return response