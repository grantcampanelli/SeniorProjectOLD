<div class="control-group" ng-class="{'error' : $field.$invalid && $field.$dirty, 'success' : $field.$valid && $field.$dirty}">
  <label class="control-label"></label>
  <div class="controls">
    <select ng-options="name for (name, value) in selectOptions">
    </select>
    <span class="help-inline" ng-repeat="error in $fieldErrors">{{$validationMessages[error](this)}}</span>
  </div>
</div>