# coding=utf-8
from rest_framework.renderers import JSONRenderer

class SmartJSONRenderer(JSONRenderer):
    """
        重载JsonRender，将结果集加入到 results:[]
        ExtJS的store 要求 get、update、put所得到的结果格式 results:[]
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
        
        #call super to render the response
        response = super(SmartJSONRenderer, self).render(response_data, accepted_media_type, renderer_context)
        
        return response