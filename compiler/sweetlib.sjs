let module = macro {
case {
        _ $moduleName requires $imports {
            defines {
                $defs ...
            }
            exports $rets
        }
    } => {
        letstx $name_str = [makeValue(unwrapSyntax(#{$moduleName}), #{here})];
        return #{
            lib.module($name_str, function $imports {
                $defs ...
                return $rets;
            });
    };
}

case {
    _ $moduleName {
        defines {
            $defs ...
        }
        exports $rets
    }
} => {
    letstx $name_str = [makeValue(unwrapSyntax(#{$moduleName}), #{here})];
    return #{
            lib.module($name_str, function () {
                $defs ...
                return $rets;
            });
};
}

case {
    _ $moduleName requires $imports {
        exports $rets
    }
} => {
    letstx $name_str = [makeValue(unwrapSyntax(#{$moduleName}), #{here})];
    return #{
            lib.module($name_str, function $imports {
                return $rets;
            });
};
}

case {
    _ $moduleName {
        exports $rets
    }
} => {
    letstx $name_str = [makeValue(unwrapSyntax(#{$moduleName}), #{here})];
    return #{
            lib.module($name_str, function () {
                return $rets;
            });
};
}

case {
    _ $moduleName requires $imports {
        defines {
            $defs ...
        }
    }
} => {
    letstx $name_str = [makeValue(unwrapSyntax(#{$moduleName}), #{here})];
    return #{
            lib.module($name_str, function $imports {
                $defs ...
            });
};
}

case {
    _ $moduleName {
        defines {
            $defs ...
        }
    }
} => {
    letstx $name_str = [makeValue(unwrapSyntax(#{$moduleName}), #{here})];
    return #{
            lib.module($name_str, function () {
                $defs ...
            });
};
}
}

let main = macro {
    rule {
        $imports $mbody
    } => {
        lib.main(function $imports $mbody);
    }

    rule {
        $mobody
    } => {
        lib.main(function () $mobody);
    }
}

let sub = macro {
    rule {
        $module.$item
    } => {
        var $item = $module.$item
    }
}

let subas = macro {
    rule {
        $module.$item, $varname
    } => {
        var $varname = $module.$item
    }
}

export module;
export main;
export sub;
export subas;