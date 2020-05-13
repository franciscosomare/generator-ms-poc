package <%= packageName %>.service;

import <%= packageName %>.entity.<%= entityName %>;
import <%= packageName %>.repository.<%= entityName %>Repository;

import java.util.List;
import java.util.Optional;

public interface <%= entityName %>Service {

    public List<<%= entityName %>> findAll<%= entityName %>s();

    public Optional<<%= entityName %>> find<%= entityName %>ById(Long id);

    public <%= entityName %> save<%= entityName %>(<%= entityName %> <%= entityVarName %>);

    public void delete<%= entityName %>ById(Long id);
}
