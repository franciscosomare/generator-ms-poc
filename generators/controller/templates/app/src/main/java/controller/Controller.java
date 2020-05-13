package <%= packageName %>.controller;

import <%= packageName %>.entity.<%= entityName %>;
import <%= packageName %>.service.<%= entityName %>Service;
import io.opentracing.Tracer;
import io.opentracing.Span;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("<%= basePath %>")
@Slf4j
public class <%= entityName %>Controller {

    private final <%= entityName %>Service <%= entityVarName %>Service;
    private Tracer tracer;

    @Autowired
    public <%= entityName %>Controller(<%= entityName %>Service <%= entityVarName %>Service, Tracer tracer) {
        this.<%= entityVarName %>Service = <%= entityVarName %>Service;
        this.tracer = tracer;
    }

    @GetMapping
    public List<<%= entityName %>> getAll<%= entityName %>s() {
        Span span = tracer.buildSpan("GET ALL <%= entityName %>").start();
        List<<%= entityName %>> list<%= entityName %> = <%= entityVarName %>Service.findAll<%= entityName %>s();
        span.finish();
        return list<%= entityName %>;
        }

    @GetMapping("/{id}")
    public ResponseEntity<<%= entityName %>> get<%= entityName %>ById(@PathVariable Long id) {
        Span span = tracer.buildSpan("GET <%= entityName %>/" + id).start();

        ResponseEntity<<%= entityName %>> responseEntity = <%= entityVarName %>Service.find<%= entityName %>ById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
        span.finish();

        return responseEntity;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public <%= entityName %> create<%= entityName %>(@RequestBody @Validated <%= entityName %> <%= entityVarName %>) {
        Span span = tracer.buildSpan("POST <%= entityName %>").start();
        <%= entityName %> <%= entityVarName %>Created = <%= entityVarName %>Service.save<%= entityName %>(<%= entityVarName %>);
        span.finish();
        return <%= entityVarName %>Created;
    }

    @PutMapping("/{id}")
    public ResponseEntity<<%= entityName %>> update<%= entityName %>(@PathVariable Long id, @RequestBody <%= entityName %> <%= entityVarName %>) {
        Span span = tracer.buildSpan("UPDATE <%= entityName %>/" + id).start();

        ResponseEntity<<%= entityName %>> responseEntity = <%= entityVarName %>Service.find<%= entityName %>ById(id)
                .map(<%= entityVarName %>Obj -> {
                    <%= entityVarName %>.setId(id);
                    return ResponseEntity.ok(<%= entityVarName %>Service.save<%= entityName %>(<%= entityVarName %>));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());

        span.finish();
        return responseEntity;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<<%= entityName %>> delete<%= entityName %>(@PathVariable Long id) {
        return <%= entityVarName %>Service.find<%= entityName %>ById(id)
                .map(<%= entityVarName %> -> {
                    <%= entityVarName %>Service.delete<%= entityName %>ById(id);
                    return ResponseEntity.ok(<%= entityVarName %>);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
